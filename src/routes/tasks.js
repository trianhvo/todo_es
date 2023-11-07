const express = require('express')
const router = express.Router()
//validate task
const {validateCreateTask, validateUpdateTask} = require('../app/middlewares/taskValidation')

//validate auth
const taskOwnershipValidation = require('../app/middlewares/taskOwnershipValidation')
const authValidation = require('../app/middlewares/authValidation')
const taskController = require('../app/controllers/TaskController')


router.post('/bulk', taskController.bulkDataset)

router.get('/search', taskController.searchTask)




router.get('/:id',authValidation, taskOwnershipValidation, taskController.getTask)


router.post('/',authValidation, validateCreateTask, taskController.createTask) 
router.put('/:id',authValidation, taskOwnershipValidation, validateUpdateTask, taskController.updateTask)
router.delete('/:id',authValidation, taskOwnershipValidation, taskController.deleteTask)


router.get('/',authValidation, taskController.getAllTask)



module.exports = router
