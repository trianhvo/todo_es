var express = require('express')
var router = express.Router()


const userController = require('../app/controllers/UserController')

router.post('/mapping/:index/:type', userController.createMapping)

router.get('/mapping', userController.getIndexMapping) //get list of users

router.get('/index', userController.getIndices) //baisc
router.post('/index', userController.createIndex) //basic
router.delete('/index', userController.deleteIndex) //basic
router.put('/index', userController.reIndex) //basic


module.exports = router
