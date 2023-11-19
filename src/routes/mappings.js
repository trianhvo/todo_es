var express = require('express')
var router = express.Router()


const mappingController = require('../app/controllers/MappingController')



/**
 * @swagger
 * /mappings:
 *   put:
 *     summary: Add a field to the mapping
 *     description: Add a new field to the mapping configuration for a specified template (e.g., users or tasks).
 *     tags:
 *       - Mapping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: string
 *                 description: The name of the mapping index.
 *               type:
 *                 type: string
 *                 description: The type of the template (e.g., users for users' template, tasks for todos' template).
 *               field:
 *                 type: string
 *                 description: The name of the field to be added to the mapping.
 *               datatype:
 *                 type: string
 *                 description: The data type of the field (e.g., text, keyword, date, etc.).
 *             required:
 *               - index
 *               - type
 *               - field
 *               - datatype
 *     responses:
 *       200:
 *         description: Field added to the mapping successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.put('/', mappingController.addFieldToMapping)


/**
 * @swagger
 * /mappings/{index}:
 *   get:
 *     summary: Get mappings of an index
 *     description: Retrieve the mappings for a specified index.
 *     tags:
 *       - Mapping
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         description: The name of the index for which to retrieve mappings.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mappings for the index retrieved successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: Index not found.
 */
router.get('/:index', mappingController.getMapping) 
/**
 * @swagger
 * /mappings:
 *   delete:
 *     summary: Reset index.
 *     description: Reset index to the default templated mapping.
 *     tags:
 *       - Mapping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: string
 *                 description: The name of the index need to reset.
 *             required:
 *               - index
 *     responses:
 *       200:
 *         description: Index reseted successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.delete('/', mappingController.resetIndex)


/**
 * @swagger
 * /mappings:
 *   post:
 *     summary: Create a new index with configured mapping
 *     description: Create a new index based on template "todos" or "users"
 *     tags:
 *       - Mapping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: string
 *                 description: The name of the new index must follow template (e.g., todos_01, user_mB, etc.) .
 *             required:
 *               - index
 *     responses:
 *       201:
 *         description: New index created successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.post('/', mappingController.createIndex)






module.exports = router
