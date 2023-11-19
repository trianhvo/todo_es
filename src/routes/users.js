var express = require('express')
var router = express.Router()
var authValidation = require('../app/middlewares/authValidation')

//require middleware
const {validateCreateUser, validateUpdateUser, validatePasswordChanging} = require('../app/middlewares/userValidation')

const userController = require('../app/controllers/UserController')


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users' information.
 *     description: Search for all users by their properties excluding password.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         description: Search for users with any property excluding password, username's just an example.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       204:
 *         description: No users found matching the criteria.
 *       400:
 *         description: Bad request - Invalid input data.
 */
router.get('/search', userController.searchUser)

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided data.
 *     tags:
 *       - Users
 *     security:
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserSchema'
 *     responses:
 *       200:
 *         description: User successfully registered.
 *       400:
 *         description: Bad request - Invalid input data.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       409:
 *         description: Conflict - User with the same username already exists.
 */
router.post('/register',validateCreateUser, userController.register)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Log in as a user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *       401:
 *         description: Unauthorized - Invalid username or password.
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out
 *     description: Log out.
 *     tags:
 *       - Users
 *     security:
 *    
 *     responses:
 */
router.post('/logout', userController.logout)


/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update user information.
 *     description: Update the public user data, excluding the password.
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserSchema'
 *     responses:
 *       200:
 *         description: User data updated successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 */
router.put('/',authValidation,validateUpdateUser, userController.updateUserData)

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Change password
 *     description: Change the password for the current user.
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordSchema'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad request - Invalid input data.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       404:
 *         description: User not found.
 */
router.put('/password',authValidation,validatePasswordChanging, userController.changePassword)


/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user
 *     description: Delete the current user.
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: User information deleted successfully.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       400:
 *         description: Bad request.
 */
router.delete('/',authValidation, userController.deleteUser)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user information
 *     description: Retrieve information about the current user.
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       400:
 *         description: Bad request.
 */
router.get('/',authValidation, userController.getUser)


module.exports = router
