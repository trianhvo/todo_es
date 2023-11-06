//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
//config env
require('dotenv').config()
//import index by env
const config = require('../../config/test-config')
const index = config.elasticsearch.index
console.log('........index used in Task Controller......', index)
const fs = require('fs');
const path = require('path');

class TaskController {
    // Func: Create task
    async createTask(req, res) {
        const { id, title, description, category, authorizedBy, dueDate } = req.body;


        // Check if the task (document) already exists
        const existedTask = await client.exists({
            index,
            type: 'tasks',
            id,
        });

        //issue: bug, if test use existed id, instead of returns this message, it just returns AxiosError 400
        if (existedTask.statusCode == 200) {
            return res.status(400).send("Task already exists!");
        }

        // Create a new task document with the provided fields
        const task = {
            id,
            title,
            description,
            category,
            authorizedBy,
            dueDate,
            status: "not started",
            createAt: new Date(),
        };
        try {
            const result = await client.index({
                index: index,
                type: 'tasks',
                id,
                body: task,
            });




            console.log('.........result......', result.body);
            return res.status(201).json({ message: 'Task created.', task: result.body });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create task.", error });
        }
    }





    //Func: Get task created
    async getTask(req, res) {
        // console.log(req.params)
        const { id } = req.params;


        try {
            const response = await client.get({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_get.html
                index,
                type: 'tasks',
                id,
            });


            const task = response.body;


            return res.json({ task });
        } catch (error) {


            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Task not found!" })
            } else {
                return res.status(500).json({ message: "Failed to get task.", error });
            }


        }
    };

    // Func: Update task
    async updateTask(req, res) {
        const { id } = req.params;
        // const { category, title, description, status, authorizedBy, dueDate } = req.body;
        try {
            // Get the task that needs to be updated
            const existingTask = await client.get({
                index: index,
                type: 'tasks',
                id,
            });
  
            const updatedTask = req.body
            // add updateAt
            updatedTask.updateAt = new Date();
            //update to db
            const updatedResult = await client.update({
                index,
                type: 'tasks',
                id,
                fields: [Object.keys(existingTask.body._source)],
                body: {
                    doc: updatedTask,
                },
            });


            return res.json({
                task: updatedResult.body.get.fields,
                version: updatedResult.body._version,
            });
        } catch (error) {
            if (error.statusCode == 404) {
                return res.status(400).json({ message: "Task not found!" });
            } else {
                return res.status(500).json({ message: "Failed to update task.", error });
            }
        }
    }



    // Func: Delete task by id on url, example: localhost:3000/users/1
    async deleteTask(req, res) {
        const { id } = req.params;
        try {
            await client.delete({
                index,
                type: 'tasks',
                id,
            });


            return res.status(200).json({ message: 'Task deleted!' });
        } catch (error) {
            console.log(error)
            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Task not found" })
            } else {
                return res.status(500).json({ message: "Failed to delete task.", error });
            }


        }
    };


    //Func: Search task
    // issue: search last/first Name (authorizedBy= 1 in 2)
    async searchTask(req, res) {
        const { sortBy = "id", sortOrder = "asc", ...filters } = req.query; //sort go sort, others go filters


        try {
            // Initialize the query
            let query = {
                bool: {
                    must: [],
                },
            };

            for (const field in filters) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
                if (filters[field]) {
                    const queryType = field === 'status' ? 'term' : 'match'; //booom


                    const pushMe = { [queryType]: { [field]: filters[field] } }
                    // console.log('..... [queryType]: { [field]: filters[field] .....', pushMe)//double check
                    query.bool.must.push(pushMe);
                }
            }


            if (query.bool.must.length === 0) {
                query = { match_all: {} };
            }

            // Create the search query
            const searchQuery = {
                index,
                body: {
                    query,
                    size: 1000,
                    // sort: sortOptions,
                    sort: [{
                        [sortBy]:{
                        order: sortOrder
                    }
                }]
                },
            };

            const response = await client.search(searchQuery);


            const tasks = response.body.hits.hits.map((hit) => {
                const task = hit._source;
                return task;
            });


            if (tasks.length === 0) {
                res.status(404).send('Task not found!');
            } else {
                res.json({ tasks });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to search for tasks.');
        }
    }






    //Bulk

    async bulkDataset(req, res) {
        const datasetPath = path.resolve(__dirname, '../../../test/dataset/dataset.json');
        const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      
        const bulkData = [];
        
        for (const object of dataset) {
          bulkData.push({ index: { _index: 'todos_test', _type: 'tasks', _id: object.id } });
          bulkData.push(object);
        }
        await client.bulk({ 
            refresh: true, 
            body: bulkData });

        res.send(bulkData)
      }
      


}
module.exports = new TaskController
