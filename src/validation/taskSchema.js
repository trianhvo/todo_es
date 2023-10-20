const taskSchema = {
    type: "object",
    properties: {
      id:{type: "string"},
      title: { type: "string" },
      status: { type: "string", enum: ["not started", "in progress", "completed"] },
      description: { type: "string" },
    },
    required: ["title", "status"],
  };
  
  module.exports = taskSchema;
  


  