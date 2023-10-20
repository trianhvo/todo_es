var express = require('express')
var router = express.Router()


const categoryController = require('../app/controllers/CategoryController')


router.get('/:type', categoryController.getTaskInCategory)


router.put('/', categoryController.addFieldToCategory)     //ajv


router.post('/', categoryController.createCategory)         //ajv

router.get('/', categoryController.getCategories)




module.exports = router
