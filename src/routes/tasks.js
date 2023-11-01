const express = require('express')
const router = express.Router()
const {validateCreateTask, validateUpdateTask} = require('../app/middlewares/ValidateMiddleware')

const taskController = require('../app/controllers/TaskController')

// router.get('/test', taskController.taskTest)

router.post('/', validateCreateTask, taskController.createTask)
router.get('/', taskController.searchTask)


router.get('/:id', taskController.getTask)
router.put('/:id', validateUpdateTask, taskController.updateTask)
router.delete('/:id', taskController.deleteTask)





module.exports = router
