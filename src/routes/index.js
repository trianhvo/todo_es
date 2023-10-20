const taskRouter = require('./tasks')
const categoryRouter = require('./categories')
const devRouter = require('./dev')

function route(app){

app.use('/categories', categoryRouter)

app.use('/tasks', taskRouter)

app.use('/dev', devRouter)

app.use('/', function(req, res){
res.json("Welcome") //issue: check if todos existed, if not, create
})




}


module.exports = route
