const Ajv = require("ajv");
const {createUserSchema, updateUserSchema} = require("../validation/schemaReader");

const ajv = new Ajv();

function validateCreateUser(req, res, next) {
  const valid = ajv.validate(createUserSchema, req.body);
  const validate = ajv.compile(createUserSchema);
  console.log('create validation pass: ', valid)
  if (!valid) {
    const validationError = ajv.errorsText(validate.errors, { separator: ' ' });

  
    const errorMessage = "Your input is invalid";
    const error = validationError;
  
    return res.status(400).json({ message: errorMessage, error });
  }
  next();
}

function validateUpdateUser(req, res, next) {
  const valid = ajv.validate(updateUserSchema, req.body);
  const validate = ajv.compile(updateUserSchema);
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
    validateCreateUser,
    validateUpdateUser
}
