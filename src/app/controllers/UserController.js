//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
//config env
require('dotenv').config()
//import index by env
const config = require('../../config/test-config')
const index = config.elasticsearch.index
console.log('........index used in User Controller......', index)
const fs = require('fs');
const path = require('path');
//jwt
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'your_secret_key'; // Replace with a strong secret key ---> So I can change this ? like: jwtSecretKey = 'gogomf'
//encrypt
const bcrypt = require('bcrypt');




class UserController {
async register(req, res) {
try {
const { username, password, email, firstName, lastName, phone } = req.body;


// Hash and salt the password before storing it
const hashedPassword = await bcrypt.hash(password, 10);


const response = await client.index({
index,
type: 'users',
body: {
username,
password: hashedPassword, // Store the hashed password
email,
firstName,
lastName,
phone,
},
});


// Generate a JWT
const token = jwt.sign({ username, email }, jwtSecretKey, { expiresIn: '1h' });


res.json({ token });
} catch (error) {
console.error(error);
res.status(500).send('Registration failed');
}
}














async login(req, res) {
const { username, password } = req.body;


try {
// Look up the user by username in db
const user = await client.search({
index,
type: 'users',
body: {
query: {
match: { username },
},
},
});
if (user.body.hits.total === 1) {
// User found -> validate the password
const storedPassword = user.body.hits.hits[0]._source.password;
// Compare the provided password with the stored password
const isPasswordValid = await bcrypt.compare(password, storedPassword);


if (isPasswordValid) {
console.log('...check...:pwd valid')
const token = jwt.sign({ username, email: user.body.hits.hits[0]._source.email }, jwtSecretKey, { expiresIn: '1h' });


res.status(200).json({ message: 'Login success', token });
} else {
res.status(401).json({ message: 'Invalid username or password.' });
}
} else {
res.status(401).json({ message: 'Invalid username or password.' });
}
} catch (error) {
console.error(error);
res.status(500).send('Login failed');
}
};


}
module.exports = new UserController


