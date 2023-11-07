const Ajv = require("ajv");
const {createTaskSchema, updateTaskSchema} = require("../validation/schemaReader");

const ajv = new Ajv();

function validateCreateTask(req, res, next) {
  const valid = ajv.validate(createTaskSchema, req.body);
  const validate = ajv.compile(createTaskSchema);
  console.log('create validation pass: ', valid)
  if (!valid) {
    const validationError = ajv.errorsText(validate.errors, { separator: ' ' });

  
    const errorMessage = "Your input is invalid";
    const error = validationError;
  
    return res.status(400).json({ message: errorMessage, error });
  }
  next();
}

function validateUpdateTask(req, res, next) {
  const valid = ajv.validate(updateTaskSchema, req.body);
  const validate = ajv.compile(updateTaskSchema);
  console.log('update validation pass: ', valid)


  if (!valid) {
    const validationError = ajv.errorsText(validate.errors, { separator: ' ' });
  
    const errorMessage = "Your input is invalid";
    const error = validationError;
  
    return res.status(400).json({ message: errorMessage, error });
  }
  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask
}
