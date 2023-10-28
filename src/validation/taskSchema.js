const fs = require('fs');

// Import JSON schemas
const createTaskSchema = JSON.parse(fs.readFileSync('createTaskSchema.json', 'utf8'));
const updateTaskSchema = JSON.parse(fs.readFileSync('updateTaskSchema.json', 'utf8'));

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
