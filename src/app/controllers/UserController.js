//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
//config env
require('dotenv').config()
//import index by env
const config = require('../../config/test-config')
const index = config.elasticsearch.userIndex
console.log('........index used in User Controller......', index)
//path and read json
const fs = require('fs');
const path = require('path');
//jwt
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'm41s3Cr3t';
//encrypt
const bcrypt = require('bcrypt');




class UserController {
    async register(req, res) {
        try {
            const { username, password, email, firstName, lastName, phone } = req.body;

            // Check if the username and email are already in use
            const usernameExists = await client.search({
                index,
                type: 'users',
                body: {
                    query: {
                        match: { username },
                    },
                },
            });

            const emailExists = await client.search({
                index,
                type: 'users',
                body: {
                    query: {
                        match: { email },
                    },
                },
            });

            if (usernameExists.body.hits.total > 0) {
                return res.status(409).json({ message: 'Username exists !' });
            }

            if (emailExists.body.hits.total > 0) {
                return res.status(409).json({ message: 'Email exists !' });
            }

            // Hash and salt the password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            const response = await client.index({
                index,
                type: 'users',
                body: {
                    username,
                    password: hashedPassword,
                    email,
                    firstName,
                    lastName,
                    phone,
                },
            });

            const token = jwt.sign({ username, email }, jwtSecretKey, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Registration failed' });
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
            res.status(401).send('Login failed');
        }
    };


    logout(req, res) {

        res.status(200).json({ message: 'Logged out successfully, and I do nothing XD' });
    };


    //issue: valid if token valid ???
    async getUser(req, res) {

        try {
            const decodedToken = jwt.verify(req.token, jwtSecretKey);
            const { email, username } = decodedToken;
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
                _source_exclude: 'password'
            });
            const userData = response.body.hits.hits[0]._source;
            res.status(200).json(userData);
        } catch (error) {
            res.status(404).json({ message: "Failed to retreive user" })
        }
    };


    async updateUserData(req, res) {


        try {
            const decodedToken = jwt.verify(req.token, jwtSecretKey);

            const { username, email } = decodedToken;

            const searchResponse = await client.search({
                index,
                body: {
                    query: {
                        bool: {
                            must: [
                                { match: { username } },
                                { match: { email } }
                            ]
                        }
                    }
                }
            })

            const userId = searchResponse.body.hits.hits[0]._id;
            const updatedUserData = req.body
            console.log('.userId.', userId, 'updatedData', updatedUserData)


            const updateResponse = await client.update({
                index,
                type: 'users',
                id: userId,
                body: {
                    doc: updatedUserData
                }
            })
            const newUsername = req.body.username
            const newEmail = req.body.email
            const newToken = jwt.sign({ username: newUsername || username, email: newEmail || email }, jwtSecretKey, { expiresIn: '1h' });

            res.status(200).json({ message: 'User data updated successfully', token: newToken });
        } catch (error) {
            throw error
        }
    };


    async changePassword(req, res) {

        try {
            const decodedToken = jwt.verify(req.token, jwtSecretKey);
            const { username, email } = decodedToken;

            const { currentPassword, newPassword } = req.body;

            const searchResponse = await client.search({
                index,
                body: {
                    query: {
                        bool: {
                            must: [
                                { match: { username } },
                                { match: { email } }
                            ]
                        }
                    }
                }
            })
            const storedPassword = searchResponse.body.hits.hits[0]._source.password;
            const userId = searchResponse.body.hits.hits[0]._id;

            const compareResult = await bcrypt.compare(currentPassword, storedPassword)
            if (!compareResult) {
                return res.json(err)
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10)




            await client.update({
                index,
                type: 'users',
                id: userId,
                body: {
                    doc: {
                        password: hashedNewPassword
                    }
                }
            })
            res.json({ message: "Done" })
        } catch (error) {
            res.status(401).json({ message: 'Failed to update password' });
        }
    };



    async deleteUser(req, res) {

        try {
            const decodedToken = jwt.verify(req.token, jwtSecretKey);

            const { username, email } = decodedToken;

            const searchResponse = await client.search({
                index,
                body: {
                    query: {
                        bool: {
                            must: [
                                { match: { username } },
                                { match: { email } }
                            ]
                        }
                    }
                }
            })

            const userId = searchResponse.body.hits.hits[0]._id;

            await client.delete({
                index,
                type: 'users',
                id: userId,
            });
            res.json({ message: "User deleted" })
        }
        catch (error) {
            return res.status(500).json({ message: "Delete failed" })
        }
    }


    //Func: Search user
    async searchUser(req, res) {
        const { sortBy = "username", sortOrder = "asc", ...filters } = req.query; //sort go sort, others go filters
        const sensitiveFields = ['password']

        const hasSensitiveFields = sensitiveFields.some(field => filters[field]);

        if (hasSensitiveFields) {
          return res.status(400).json({ error: 'You cannot search by sensitive fields.' });
        }

        
        try {
            // Initialize the query
            let query = {
                bool: {
                    must: [],
                },
            };

            for (const field in filters) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
                if (filters[field]) {
                    const queryType = field === 'username' || field === 'email' ? 'term' : 'match';


                    const pushMe = { [queryType]: { [field]: filters[field] } }
                    // console.log('..... [queryType]: { [field]: filters[field] .....', pushMe)//double check
                    query.bool.must.push(pushMe);
                }
            }


            if (query.bool.must.length === 0) {
                query = { match_all: {} };
            }

            // Create the search query
            const searchQuery = {
                index,
                body: {
                    query,
                    size: 1000,
                    // sort: sortOptions,
                    sort: [{
                        [sortBy]: {
                            order: sortOrder
                        }
                    }],
                    _source: {
                        exclude: sensitiveFields
                    }
                },
            };

            const response = await client.search(searchQuery);

            const tasks = response.body.hits.hits.map((hit) => {
                const task = hit._source;
                return task;
            });


            if (tasks.length === 0) {
                res.status(404).send('User not found!');
            } else {
                res.json({ message: `total users found: ${response.body.hits.total}`, tasks });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to search for users.');
        }
    }












}
module.exports = new UserController


