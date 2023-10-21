const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });


class DevController {




async createMapping(req, res) {
const { index, type } = req.params;
try {
const mapping = req.body;




await client.indices.putMapping({
index,
type,
body: mapping,
});


res.send('Mapping created');
} catch (error) {
console.error(error);
res.status(500).send('Failed to created mapping.');
}
};




async getIndexMapping(req, res) {
const { index } = req.body;


try {
const mapping = await client.indices.getMapping({ index });


res.json(mapping);
} catch (error) {
console.error(error);
res.status(500).send('Failed to get index mapping.');
}
};






async getTypeMapping(req, res) {
const { index } = req.body;
const { type } = req.params;


// console.log('index: ', index ) //bug: can return without index
// console.log('type: ', type )
try {
const mapping = await client.indices.getMapping({ index, type });


res.json(mapping);
} catch (error) {
console.error(error);
res.status(500).send('Failed to get mapping.');
}
};






async getIndices(req, res) {
try {
const { index } = req.body
const response = await client.cat.indices({
index
});


res.json({ indices: response.body });
} catch (error) {
console.error(error); res.status(500).send('');
}
}


async createIndex(req, res) {
try {
const { index } = req.body
const response = await client.indices.create({ index });


res.json({ message: `Index ${index} created`, response });
} catch (error) {
console.error(error); res.status(500).send('');
}
}






async deleteIndex(req, res) {
try {
const { index } = req.body;
const response = await client.indices.delete({ index });
res.json({ message: `Index ${index} deleted`, response });
} catch (error) {
console.error(error); res.status(500).send('Failed to delete index.');
}
}


async reIndex(req, res) {
try {
const { body } = req.body
const response = await client.reindex({ body });
res.json({ message: '', response });
} catch (error) {
console.error(error);
res.status(500).send('Error msg');
}
}




}


module.exports = new DevController