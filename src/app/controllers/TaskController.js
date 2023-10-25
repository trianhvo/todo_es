const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
require('dotenv').config()
const config = require('../../config/test-config')
const configuredIndex = config.elasticsearch.index




class TaskController {


    //Create task
    async createTask(req, res) {
        const { category, id, title, description } = req.body;
        //index with config for main/test
        const index = configuredIndex;
        const existedTask = await client.exists({
            index: index,
            type: category,
            id: id
        })
        if (existedTask.statusCode == 200) {
            return res.status(400).send("Task existed!")
        }






        // Create a new document
        const task = {
            id,
            title,
            description,
            status: "not started",
        };
        try {
            const result = await client.index({
                index: index,
                type: category,
                id: id,
                body: task,
            });
            const createdTask = {
                id: result.body._id,
                title,
                description,
                status: "not started",
            };
            res.status(201).json({ message: 'Task created.', task: createdTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to create task.", error });
        }
    };




    //Get task created
    async getTask(req, res) {
        // console.log(req.params)
        const { type, id } = req.params;


        try {
            const response = await client.get({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_get.html
                index: configuredIndex,
                type,
                id,
            });


            const task = response.body;


            res.json({ task });
        } catch (error) {


            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Task not existed!" })
            } else {
                return res.status(500).json({ message: "Failed to get task.", error });
            }
        }
    };




    // Update task field


    async updateTask(req, res) {
        const { type, id } = req.params;
        const { title, description, status } = req.body;


        try {
            // Get the task need to update
            const existingTask = await client.get({
                index: configuredIndex,
                type,
                id,
            });


            // console.log(existingTask);


            //Update field in _source
            const updatedTask = existingTask.body._source;


            if (title) {
                updatedTask.title = title;
            }
            if (description) {
                updatedTask.description = description;
            }
            if (status) {
                updatedTask.status = status;
            }


            // Update the task in db
            const updatedResult = await client.update({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_update.html
                index: configuredIndex,
                type,
                id,
                body: {
                    doc: updatedTask,
                },
            });
            res.json({
                task: updatedTask,
                version: updatedResult.body._version
            });
        } catch (error) {


            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Task not found!" })
            } else {
                return res.status(500).json({ message: "Failed to update task.", error });
            }
        }
    };




    // Delete a specific task document by type and ID
    async deleteTask(req, res) {
        const { type, id } = req.params;
        try {
            const taskDeleted = await client.delete({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_delete.html
                index: configuredIndex,
                type,
                id,
            });
            res.status(200).json({ message: 'Task deleted!' });
        } catch (error) {
            console.log(error)
            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Task not found" })
            } else {
                return res.status(500).json({ message: "Failed to delete task.", error });
            }
        }
    };




    // Search task w/ query params
    //issue: add sort
    async searchTask(req, res) {
        const { title, description, status } = req.query;
        try {
            let query = {
                bool: {
                    must: [],
                },
            };
            if (title) {
                query.bool.must.push({ match: { title } });
            }
            if (description) {
                query.bool.must.push({ match: { description } });
            }
            if (status) {
                query.bool.must.push({ term: { status } });
            }
            if (query.bool.must.length === 0) {
                query = { match_all: {} };
            }
            const searchQuery = {
                index: configuredIndex,
                body: {
                    query,
                    size: 1000
                },
            };
            const response = await client.search(searchQuery);
            const tasks = response.body.hits.hits.map((hit) => {
                const task = hit._source;
                task.category = hit._type;
                return task;
            });
            if (tasks.length === 0) {
                res.status(404).send('Task not found');
            } else {
                res.json({ tasks });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to search for tasks.');
        }
    };


    async taskTest(req, res) {


        const { body } = await client.search({
            index: configuredIndex,
            body: {
                query: {
                    term: {
                        status: "in progress"
                    }
                }
            }
        })
        console.log(body.hits.hits)
        res.send(body.hits.hits)
    }
























}
module.exports = new TaskController
