const Ajv = require("ajv");
const createTaskSchema = require("../../validation/taskSchema").createTaskSchema;
const updateTaskSchema = require("../../validation/taskSchema").updateTaskSchema;


const ajv = new Ajv();


function validateCreateTask(req, res, next) {
const valid = ajv.validate(createTaskSchema, req.body);
console.log(valid)
if (!valid) {
const validationErrors = ajv.errors;
return res.status(400).json({ message: "You shall not pass!", errors: validationErrors });
}
next();
}


function validateUpdateTask(req, res, next) {
const valid = ajv.validate(updateTaskSchema, req.body);


console.log(valid)
if (!valid) {
const validationErrors = ajv.errors;
return res.status(400).json({ message: "You shall not pass!", errors: validationErrors });
}
next();
}


module.exports = {
validateCreateTask,
validateUpdateTask
}
