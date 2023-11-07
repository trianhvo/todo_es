var express = require('express')
var router = express.Router()


const mappingController = require('../app/controllers/MappingController')




router.put('/', mappingController.addFieldToMapping)     
router.get('/:index', mappingController.getMapping) 
router.delete('/', mappingController.deleteIndex)
router.post('/', mappingController.createIndex)






module.exports = router
