const fs = require('fs');
const path = require('path')

const createTaskSchemaPath = path.resolve(__dirname, './schema/createTaskSchema.json')
const updateTaskSchemaPath = path.resolve(__dirname, './schema/updateTaskSchema.json')
const createUserSchemaPath = path.resolve(__dirname, './schema/createUserSchema.json')
const updateUserSchemaPath = path.resolve(__dirname, './schema/updateTaskSchema.json')

const createTaskSchema = JSON.parse(fs.readFileSync(createTaskSchemaPath, 'utf8'));
const updateTaskSchema = JSON.parse(fs.readFileSync(updateTaskSchemaPath, 'utf8'));
const createUserSchema = JSON.parse(fs.readFileSync(createUserSchemaPath, 'utf8'));
const updateUserSchema = JSON.parse(fs.readFileSync(updateUserSchemaPath, 'utf8'));



module.exports = {
  createTaskSchema,
  updateTaskSchema,
  createUserSchema,
  updateUserSchema
};
