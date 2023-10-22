// create schema
const createTaskSchema = {
  type: "object",
  properties: {
  category: { type: "string" },
  id: { type: "number" },
  title: { type: "string", minLength: 3, maxLength: 100 },
  description: { type: "string", maxLength: 500 },
  },
  required: ["title", "id"],
  //issue: must not include status
  };
  
  
  // update schema
  const updateTaskSchema = {
  type: "object",
  properties: {
  category: { type: "string" },
  id: { type: "string" },
  title: { type: "string", minLength: 3, maxLength: 100 },
  description: { type: "string", maxLength: 500 },
  status: { type: "string", enum: ["open", "in progress", "completed"] },
  },
  required: [],
  };
  
  
  module.exports = {
  createTaskSchema,
  updateTaskSchema
  };
  