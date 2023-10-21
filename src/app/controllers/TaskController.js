const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });




class TaskController {


//Create task
//issue: not allow re-create task
async createTask(req, res) {
const { category, id, title, description, status } = req.body;


const existedTask = await client.exists({
index: 'todos',
type: category,
id: id
})


if(existedTask){
res.status(400).send("Task existed")
}












// Create a new document
const task = {
id,
title,
description,
status,
};
try {
const result = await client.index({
index: 'todos',
type: category,
id: id,
body: task,
});
const createdTask = {
_id: result._id,
title,
description,
status: "not started",
};
res.status(201).json({ message: 'Task created', task: createdTask }); //simplify
} catch (error) {
console.error(error);
res.status(500).send('Task creation failed.');
}
};




//Get task created
async getTask(req, res) {
// console.log(req.params)
const { type, id } = req.params;


try {
const response = await client.get({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_get.html
index: 'todos',
type,
id,
});


const task = response.body;


res.json({ task });
} catch (error) {
console.error(error);
res.status(500).send('Task not found.');
}
};




// Update task field
async updateTask(req, res) {
const { type, id } = req.params;
const { title, description, status } = req.body;


try {
// Get the task need to update
const existingTask = await client.get({
index: 'todos',
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
await client.update({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_update.html
index: 'todos',
type,
id,
body: {
doc: updatedTask, //this ?
},
});


res.json({ task: updatedTask });
} catch (error) {
console.error(error);
res.status(500).send('Failed to update task.');
}
};




// Delete a specific task document by type and ID
async deleteTask(req, res) {
const { type, id } = req.params;


try {
await client.delete({ //https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_delete.html
index: 'todos',
type,
id,
});


res.send('Task deleted');
} catch (error) {
console.error(error);
res.status(500).send('Failed to delete the task.');
}
};




// Search task w/ query params
async searchTask(req, res){
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
index: 'todos',
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


async searchTest(req, res) {
const { body } = await client.search({
index: 'todos',
body: {
query: {
term: {
status: "completed"
}
}
}
})


console.log(body.hits.hits)
res.send("ok")
}
























}
module.exports = new TaskController