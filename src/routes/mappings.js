var express = require('express')
var router = express.Router()


const mappingController = require('../app/controllers/MappingController')


// router.get('/:type', mappingController.getTaskInMapping) // remove


router.put('/', mappingController.addFieldToMapping)     
router.get('/', mappingController.getMapping) 
router.delete('/', mappingController.deleteIndex)
router.post('/', mappingController.createMapping)






module.exports = router
