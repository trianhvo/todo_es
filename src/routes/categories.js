var express = require('express')
var router = express.Router()




const categoryController = require('../app/controllers/CategoryController')




router.get('/:type', categoryController.getTaskInCategory)




router.put('/', categoryController.addFieldToCategory)




router.post('/', categoryController.createCategory)


router.get('/', categoryController.getCategories)








module.exports = router