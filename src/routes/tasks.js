var express = require('express')
var router = express.Router()


const taskController = require('../app/controllers/TaskController')


router.get('/test', taskController.searchTest) 
router.post('/', taskController.createTask) //ajv
router.get('/', taskController.searchTask)




router.get('/:type/:id', taskController.getTask) 
router.patch('/:type/:id', taskController.updateTask) //ajv
router.delete('/:type/:id', taskController.deleteTask)





module.exports = router

