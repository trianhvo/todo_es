//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
//config env
require('dotenv').config()


//import index by env
const config = require('../../config/test-config')
const configuredIndex = config.elasticsearch.index
console.log('........index used in Mapping Controller......', config)


class MappingController {




    // Func: Create a new mapping
    async createMapping(req, res) {
        try {




            const existedType = await client.indices.existsType({
                index: configuredIndex,
                type: 'tasks',
            })
            if (existedType.statusCode == 200) {
                return res.status(400).send("Can not create mapping: type existed!")
            }


            const manualMapping = req.body;
            if (manualMapping) {


            }


            // Define the default mapping
            const defaultMapping = {
                properties: {
                    category: { type: 'text' },
                    id: { type: 'long' },
                    title: { type: 'text' },
                    description: { type: 'text' },
                    status: { type: 'keyword' },
                    authorizedBy: {
                        properties: {
                            firstName: { type: 'text' },
                            lastName: { type: 'text' },
                        },
                    },
                    dueDate: { type: 'date' },
                    createAt: { type: 'date' },
                    updateAt: { type: 'date' },
                },
            };






            const mapping = Object.keys(manualMapping).length > 0 ? manualMapping : defaultMapping;
            // console.log('.......mapping.......',manualMapping)


            await client.indices.putMapping({
                index: configuredIndex,
                type: 'tasks',
                body: mapping,
            });




            res.status(201).json('Mapping created');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to create mapping.');
        }
    }








    // Func: Add fields to a mapping
    async addFieldToMapping(req, res) {


        const { field, datatype } = req.body;




        console.log('field: ', field)
        console.log('datatype', datatype)
        try {
            // Temp mapping
            const fieldMapping = {
                properties: {
                    [field]: {
                        type: datatype,
                    },
                },
            };
            console.log('fieldMapping', fieldMapping)


            // Update the mapping
            await client.indices.putMapping({
                index: configuredIndex,
                type: 'tasks',
                body: fieldMapping,
            });


            res.send('Mapping updated');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to update mapping.');
        }
    };








    //Func: get mapping
    async getMapping(req, res) {
        const fields = req.params
        console.log(fields)
        try {


            const mapping = await client.indices.getMapping({
                index: configuredIndex,
                type: 'tasks'


            })
            res.status(200).json(mapping.body.todos.mappings.tasks);


        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to get index mapping.');
        }
    };


    //Func: delete mapping (delete index)
    async deleteIndex(req, res) {
        const index = configuredIndex
        try {
            await client.indices.delete({
                index: index
            });
            const response = await client.indices.create({
                index: index
            });


            res.json({ message: 'Done!' });
        } catch (error) {
            console.error(error); res.status(500).send('Failed to delete index.');
        }
    }








}


module.exports = new MappingController