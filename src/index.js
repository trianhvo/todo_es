const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const route = require('./routes/index')
require('dotenv').config()

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../src/config/swaggerDoc');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

console.log('......env.........', process.env.NODE_ENV)
app.use(express.json());
app.use(bodyParser.json());


route(app)




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



