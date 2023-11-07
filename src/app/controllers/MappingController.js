//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
//config env
require('dotenv').config()

//import index by env
const config = require('../../config/test-config');
const { response } = require('express');
const index = config.elasticsearch.todosIndex
console.log('........index used in Mapping Controller......', index)





class MappingController {


  // Func: Create index with template
  async createIndex(req, res) {
      const {index} = req.body
    try {
      const response = await client.indices.create({
        index,
      })
      res.status(201).json(`Index ${index} created`);
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }




  // Func: Add fields to a mapping
  async addFieldToMapping(req, res) {

    const { index, type, field, datatype } = req.body;
    try {
      // Temp mapping
      const fieldMapping = {
        properties: {
          [field]: {
            type: datatype,
          },
        },
      };

      // Update the mapping 
      await client.indices.putMapping({
        index,
        type,
        body: fieldMapping,
      });

      res.send('Mapping updated');
    } catch (error) {
      res.status(500).send('Failed to update mapping.');
    }
  };




  //Func: get mapping
  async getMapping(req, res) {
    const {index} = req.params
    try {

      const mapping = await client.indices.getMapping({
        index
      })
      res.status(200).json(mapping.body);

    } catch (error) {
      if(error.statusCode == 404){
        res.status(404).send('Not found index.')
      }else{
        res.status(400).send('Failed to get index mapping.')
      }
    }
  };

  //Func: delete mapping (delete index)
  //issue: add not found mapping
  async deleteIndex(req, res) {
    const {index} = req.body
    try {
      const response = await client.indices.delete({
        index
      });
      
      await client.indices.create({
        index
      });

      res.json({ message: 'Done!' });
    } catch (error) {
      res.status(400).send('Failed to delete index.');
    }
  }




}

module.exports = new MappingController
