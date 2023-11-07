var express = require('express')
var router = express.Router()
var authValidation = require('../app/middlewares/authValidation')
const {validateCreateUser, validateUpdateUser} = require('../app/middlewares/userValidation')


const userController = require('../app/controllers/UserController')

router.get('/search', userController.searchUser)

router.post('/register',validateCreateUser, userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.put('/',authValidation,validateUpdateUser, userController.updateUserData)
router.put('/password',authValidation,validateUpdateUser, userController.changePassword)

router.delete('/',authValidation, userController.deleteUser)
router.get('/',authValidation, userController.getUser)


module.exports = router
