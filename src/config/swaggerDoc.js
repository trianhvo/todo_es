const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swaggerConfig');

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;