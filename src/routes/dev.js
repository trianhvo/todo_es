var express = require('express')
var router = express.Router()




const devController = require('../app/controllers/DevController')


router.post('/mapping/:index/:type', devController.createMapping)
router.get('/mapping/:type', devController.getTypeMapping)


router.get('/mapping', devController.getIndexMapping)


router.get('/index', devController.getIndices)
router.post('/index', devController.createIndex)
router.delete('/index', devController.deleteIndex)
router.put('/index', devController.reIndex)




module.exports = router

