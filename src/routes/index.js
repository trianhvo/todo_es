const taskRouter = require('./tasks')
const mappingRouter = require('./mapping')
const devRouter = require('./dev')

const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

const options = require('../config/swagger-ui')


function route(app) {

  app.use('/mapping', mappingRouter)

  app.use('/tasks', taskRouter)

  app.use('/dev', devRouter)

  // const specs = swaggerJsdoc(options);
  // app.use(
  //   "/api-docs",
  //   swaggerUi.serve,
  //   swaggerUi.setup(specs, { explorer: true })
  // );


  app.use('/', function (req, res) {
    res.json("Welcome")
  })


}


module.exports = route