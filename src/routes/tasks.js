const express = require('express')
const router = express.Router()
//validate task
const {validateCreateTask, validateUpdateTask} = require('../app/middlewares/taskValidation')

//validate auth
const taskOwnershipValidation = require('../app/middlewares/taskOwnershipValidation')
const authValidation = require('../app/middlewares/authValidation')

const taskController = require('../app/controllers/TaskController')

router.post('/bulktasks', taskController.bulkTasksDataset)
router.post('/bulkusers', taskController.bulkUsersDataset)


/**
 * @swagger
 * /tasks/search:
 *   get:
 *     summary: Search tasks
 *     description: Search for tasks, with optional sorting, based on provided query parameters. By default, tasks are sorted by id in ascending order.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         description: Search keywords, title's just an example, can use others properties
 *         schema:
 *           type: string
 *              
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Sort tasks by the specified field (e.g., sortBy=id). Optional.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         description: Specify sorting order (e.g., sortOrder=asc). Optional.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results retrieved successfully.
 *       204:
 *         description: No search results found.
 */

router.get('/search', taskController.searchTask)

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve a task, which belong to the current user, by id.
 *     tags:
 *       - Tasks
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique id of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       403:
 *         description: Forbidden - You don't have permission to access this task.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Unknown error.
 */
router.get('/:id',authValidation, taskOwnershipValidation, taskController.getTask)

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided data.
 *     tags:
 *       - Tasks
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskSchema'
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       400:
 *         description: Bad request - Task already exists.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       500:
 *         description: Server error - Failed to create a task.
 */
router.post('/',authValidation, validateCreateTask, taskController.createTask) 


/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     description: Update a task with the specified ID that belongs to the current user.
 *     tags:
 *       - Tasks
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskSchema'
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       403:
 *         description: Forbidden - You don't have permission to update this task.
 *       404:
 *         description: Task not found.
 *       409:
 *         description: Conflict - Task update conflict.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Unknown error.
 */
router.put('/:id',authValidation, taskOwnershipValidation, validateUpdateTask, taskController.updateTask)


/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Delete a task with the specified ID that belongs to the current user.
 *     tags:
 *       - Tasks
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       403:
 *         description: Forbidden - You don't have permission to delete this task.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Unknown error.
 */
router.delete('/:id',authValidation, taskOwnershipValidation, taskController.deleteTask)

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks belonging to the current user.
 *     tags:
 *       - Tasks
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: All tasks retrieved successfully.
 *       204:
 *         description: Current user does not have any task.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 */
router.get('/',authValidation, taskController.getAllTask)



module.exports = router
