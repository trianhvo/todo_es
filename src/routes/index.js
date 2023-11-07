const taskRouter = require('./tasks')
const mappingRouter = require('./mappings')
const userRouter = require('./users')
const templateRouter = require('./templates')


function route(app){

app.use('/mappings', mappingRouter)

app.use('/tasks', taskRouter)

app.use('/users', userRouter)

app.use('/templates', templateRouter)

app.use('/', function(req, res){
    console.log("Welcome") 
})




}


module.exports = route
