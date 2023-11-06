const fs = require('fs');
const path = require('path')

const createTaskSchemaPath = path.resolve(__dirname, './schema/createTaskSchema.json')
const updateTaskSchemaPath = path.resolve(__dirname, './schema/updateTaskSchema.json')

const createTaskSchema = JSON.parse(fs.readFileSync(createTaskSchemaPath, 'utf8'));
const updateTaskSchema = JSON.parse(fs.readFileSync(updateTaskSchemaPath, 'utf8'));

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
