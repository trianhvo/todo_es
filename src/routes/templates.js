var express = require('express')
var router = express.Router()


const templateController = require('../app/controllers/TemplateController')




router.delete('/:name', templateController.deleteTemplate)
router.get('/:name', templateController.getTemplate)

router.post('/todos', templateController.createTemplateTodos)
router.post('/users', templateController.createTemplateUsers)




module.exports = router
