const express = require('express')
const router = express.Router()
const validateCreateTask = require('../app/middlewares/ValidateMiddleware').validateCreateTask
const validateUpdateTask = require('../app/middlewares/ValidateMiddleware').validateUpdateTask

const taskController = require('../app/controllers/TaskController')


router.post('/bulk', taskController.bulkDataset)


router.post('/', validateCreateTask, taskController.createTask)
router.get('/', taskController.searchTask)




router.get('/:id', taskController.getTask)
router.put('/:id', validateUpdateTask, taskController.updateTask)
router.delete('/:id', taskController.deleteTask)





module.exports = router
