var express = require('express')
var router = express.Router()


const templateController = require('../app/controllers/TemplateController')



/**
 * @swagger
 * /templates/{name}:
 *   delete:
 *     summary: Delete template by name
 *     description: Delete a template by its name
 *     tags:
 *       - Template
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the template to delete (e.g., "todos" or "users").
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: Template not found.
 */
router.delete('/:name', templateController.deleteTemplate)

/**
 * @swagger
 * /templates/{name}:
 *   get:
 *     summary: Get template by name.
 *     description: Retrieve a template by its name.
 *     tags:
 *       - Template
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the template to retrieve (i.e., "todos" or "users").
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template retrieved successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: Template not found.
 */
router.get('/:name', templateController.getTemplate)

/**
 * @swagger
 * /templates/todos:
 *   post:
 *     summary: Create template for todos' indices
 *     description: Create a template for indices with prefix "todos"
 *     tags:
 *       - Template
 *     responses:
 *       201:
 *         description: Template for todos' indices created successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.post('/todos', templateController.createTemplateTodos)

/**
 * @swagger
 * /templates/users:
 *   post:
 *     summary: Create template for user's indices
 *     description: Create a template for indices with prefix "users"
 *     tags:
 *       - Template
 *     responses:
 *       201:
 *         description: Template for user's indices created successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.post('/users', templateController.createTemplateUsers)




module.exports = router
