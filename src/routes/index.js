const taskRouter = require('./tasks')
const categoryRouter = require('./categories')
const devRouter = require('./dev')
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

const options = require('../config/swagger-ui')


function route(app){


app.use('/categories', categoryRouter)


app.use('/tasks', taskRouter)


app.use('/dev', devRouter)



const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
app.use('/', function(req, res){
res.json("Welcome") //issue: check if todos existed, if not, create
})








}




module.exports = route