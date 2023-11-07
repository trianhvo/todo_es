const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const config = require('../../config/test-config');
const index = config.elasticsearch.userIndex;

const jwt = require('jsonwebtoken');
const jwtSecretKey = 'm41s3Cr3t';


console.log('......index used in auth............',index)
const authValidation = async (req, res, next) => {

  const tokenExists = req.header('Authorization')
  if (!tokenExists) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = tokenExists.replace('Bearer ', '');
  const decodedToken = jwt.verify(token, jwtSecretKey);
  const { email, username } = decodedToken;


  try {
    const response = await client.search({
      index: index,
      type: 'users', 
      body: {
        query: {
          bool: {
            must: [
              { term: { email: email } },
              { term: { username: username } },
            ],
          },
        },
      },
    });
    if (response.body.hits.total === 0) {
      throw new Error('User not found');
    } else {
      const userData = response.body.hits.hits[0]._source;
      const userId = response.body.hits.hits[0]._id;
      req.userId = userId
      req.userData = userData;
      req.token = token;

      next();
    }
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

module.exports = authValidation;
