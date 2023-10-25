const express = require('express')
const router = express.Router()
const validateCreateTask = require('../app/middlewares/ValidateMiddleware').validateCreateTask
const validateUpdateTask = require('../app/middlewares/ValidateMiddleware').validateUpdateTask


const taskController = require('../app/controllers/TaskController')




router.get('/test', taskController.taskTest)
router.post('/', validateCreateTask, taskController.createTask)
router.get('/', taskController.searchTask)








router.get('/:type/:id', taskController.getTask)
router.patch('/:type/:id', validateUpdateTask, taskController.updateTask)
router.delete('/:type/:id', taskController.deleteTask)










module.exports = router
