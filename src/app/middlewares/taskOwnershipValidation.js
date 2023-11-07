const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const config = require('../../config/test-config');
const index = config.elasticsearch.todosIndex;



const taskOwnershipValidation = async (req, res, next) => {
    const taskId = req.params.id;
    try {
      const task = await client.get({
        index,
        type: "tasks",
        id: taskId,
      });
  
      
      if (task.body._source.userId === req.userId) {
        console.log('You own this task')
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      res.status(404).json({ message: 'Task not found' });
    }
  };
  
  module.exports = taskOwnershipValidation;
  