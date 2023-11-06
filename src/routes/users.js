var express = require('express')
var router = express.Router()


const userController = require('../app/controllers/UserController')

router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router
