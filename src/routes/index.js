// const { Client, errors } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://localhost:9200' });


const taskRouter = require('./tasks')
const mappingRouter = require('./mappings')
const userRouter = require('./users')



function route(app){

app.use('/mappings', mappingRouter)

app.use('/tasks', taskRouter)

app.use('/users', userRouter)

app.use('/', function(req, res){
    console.log("Welcome") 
})




}


module.exports = route
