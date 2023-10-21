const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });




class CategoryController {




// Create a new category
async createCategory(req, res) {
const category = req.body.category;


const index = 'todos';
const type = category;


// Define the mapping
const mapping = {
properties: {
id: {type: 'long'},
title: { type: 'text' },
description: { type: 'text' },
status: { type: 'keyword' },
createDate: { type: 'date' } //issue: work with this
}
};


// Update the index mapping for the new type: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/5.x/_indices_putmapping.html
await client.indices.putMapping({
index,
type,
body: mapping,
}, (err, resp, status) => {
if (err) {
console.error(err);
res.status(500).send('Category creation failed.')
} else {
res.status(201).send('Category created.')
}
});
};




// Get all category names from the 'todos' index
async getCategories(req, res){
try {
const index = 'todos';


const { body } = await client.indices.getMapping({ index });


const categories = Object.keys(body[index].mappings);




res.json({ categories });
} catch (error) {
console.error(error);
res.status(500).send('Failed to get categories.');
}
};




// Get all tasks in category
async getTaskInCategory(req, res){
const { type } = req.params;
// console.log(type)
try {
const response = await client.search({
index: 'todos',
type,
body: {
query: {
match_all: {},
},
},
});
const tasks = response.body.hits.hits.map((hit) => hit._source);
res.json({ tasks });
} catch (error) {
console.error(error);
res.status(500).send('Cannot get tasks');
}
};


// Add fields to a category
async addFieldToCategory(req, res){
const { category } = req.body;
const { field, datatype } = req.body;


console.log('category: ', category)
console.log('field: ', field)
console.log('datatype', datatype)
try {
// Temp mapping
const fieldMapping = {
properties: {
[field]: {
type: datatype,
},
},
};
console.log('fieldMapping', fieldMapping)


const updateMapping = {
[category]: fieldMapping,
};
console.log('updateMapping', updateMapping)


// Update the mapping for the category (type)
await client.indices.putMapping({
index: 'todos',
type: category,
body: updateMapping,
});


res.send('Category updated');
} catch (error) {
console.error(error);
res.status(500).send('Failed to update category mapping.');
}
};




}


module.exports = new CategoryController