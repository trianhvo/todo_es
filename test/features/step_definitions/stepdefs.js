const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const fs = require('fs')
const path = require('path')

const Ajv = require('ajv');
const ajv = new Ajv();
const { createTaskSchema, updateTaskSchema } = require("../../../src/app/validation/taskSchema");

require('dotenv').config()
const config = require('../../../src/config/test-config')
const index = config.elasticsearch.index

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const { expect } = require('chai');
const { error } = require('console');

let apiResponse;


Given('index todos_test with a dataset', async function () {
    await axios.post('http://localhost:3000/mappings')
    await axios.post('http://localhost:3000/tasks/bulk')
});

Given('path url method {string} with task ID {int}', function (string, id) {
    this.id = id;
    this.url = `http://localhost:3000/tasks/${this.id}`;

});

When('use method GET', async function () {

    try {
        const response = await axios.get(this.url);
        apiResponse = response;

    } catch (error) {
        throw error;
    }
});

Then('I get response status code {int}', function (expectedStatusCode) {

    const actualStatusCode = apiResponse.status;
    if (actualStatusCode !== expectedStatusCode) {
        throw new Error(`Expected status code ${expectedStatusCode}, but received ${actualStatusCode}`);
    }
});

Then('I verify the output\'s title matches {}', function (expectedTitle) {
    try {
        const actualTitle = apiResponse.data.task._source.title
        if (actualTitle !== expectedTitle) {
            throw new Error(`Expected title: ${expectedTitle}, but received ${actualTitle}`);
        }
    } catch (error) {
        throw error;
    }
});

Then('I drop mapping', async function () {
    try {
        // Delete the mapping
        await axios.delete('http://localhost:3000/mappings');
    } catch (error) {
        throw error;
    }
});


//----------------------------------------------------
Given('path url method POST', function () {
    this.url = 'http://localhost:3000/tasks';
});


Given('task data from json file {}', function (jsonFile) {

    const jsonFilePath = path.resolve(__dirname, '../data_test', jsonFile)

    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf-8')
        this.taskData = JSON.parse(jsonData)
    } catch (error) {
        throw error
    }

});



Then('these data pass createTask validation', function () {
    const validate = ajv.compile(createTaskSchema);
    const isValid = validate(this.taskData);


    if (!isValid) {
        const validationError = ajv.errorsText(validate.errors, { dataVar: 'taskData' });
        throw new Error(`Input data did not pass validation: ${validationError}`);
    }
});



When('use method POST', async function () {

    try {
        const response = await axios.post(this.url, this.taskData);
        apiResponse = response;
    } catch (error) {
        throw error;
    }
});



Then('result\'s id matches {int}', function (expectedId) {
    try {

        const actualId = parseInt(apiResponse.data.task._id)
        if (actualId !== expectedId) {
            throw new Error(`Expected title: ${expectedId}, but received ${actualId}`);
        }
    } catch (error) {
        throw error;
    }
});

//------------------------------------------------------



Then('task existed', async function () {
    try {
        const existedTask = await client.exists({
            index,
            type: 'tasks',
            id: this.id,
        });

        if (existedTask.statusCode !== 200) {
            throw new Error('Task not exists')
        }
    } catch (error) {
        throw error
    }
})


Then('these data pass updateTask validation', function () {
    const validate = ajv.compile(updateTaskSchema);
    const isValid = validate(this.taskData);


    if (!isValid) {
        const validationError = ajv.errorsText(validate.errors, { dataVar: 'taskData' });
        throw new Error(`Input data did not pass validation: ${validationError}`);
    }
});


When('use method PUT', async function () {
    try {

        const response = await axios.put(this.url, this.taskData)
        apiResponse = response

    } catch (error) {
        throw error
    }
});


Then('result\'s status matches {}', function (expectedTaskStatus) {
    try {
        const actualTaskStatus = (apiResponse.data.task.status).toString()

        if (actualTaskStatus !== expectedTaskStatus) {
            throw new Error(`Expected title: ${expectedTaskStatus}, but received ${actualTaskStatus}`);
        }
    } catch (error) {
        throw error;
    }
});

//-----------------------------------------------------------
When('use method DELETE', async function () {

    try {
        const response = await axios.delete(this.url, this.id)
        apiResponse = response

    } catch (error) {
        throw error
    }
});

//------------------------------------------------------------
Given('path url to search', function () {
    this.url = 'http://localhost:3000/tasks';
});


When('use api search task', async function () {


    try {
        const response = await axios.get(this.url, {
            params: this.taskData
        });
        apiResponse = response;

    } catch (error) {
        throw error;
    }
});


Then('result matches data in {}', function (expectedFile) {
    const jsonFilePath = path.resolve(__dirname, '../data_test', expectedFile)
    try {
        const expectedResult = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

        expect(apiResponse.data.tasks).to.deep.equal([expectedResult])
    } catch (error) {
        throw error
    }
});

// ------------------------------------------------------------------
//------------------------------------------------------------------------------
Given('path url method {string} with non-existent task ID {int}', function (string, id) {
    this.id = id;
    this.url = `http://localhost:3000/tasks/${this.id}`;
});

When('use failed method GET', async function () {
    try {
        await axios.get(this.url);


    } catch (error) {
        this.error = error.response
    }
});

Then('I get response error status code {int}', function (expectedErrorStatus) {
    // console.log(this.error)
    const actualErrorStatus = this.error.status;
    if (actualErrorStatus !== expectedErrorStatus) {
        throw new Error(`Expected error with status code ${expectedErrorStatus}, but received ${actualErrorStatus}`);
    }
});

Then('I receive message {string}', function (expectedMessage) {

    const messageRecieved = this.error.data.message
    if (messageRecieved !== expectedMessage) {
        throw new Error(`Expected: ${expectedMessage}, but received ${messageRecieved}`);
    }
});

//--------------------------------------------------------------------
When('use failed method DELETE', async function () {
    try {
        await axios.get(this.url);

    } catch (error) {
        this.error = error.response
    }
})
//---------------------------------------------------------------------
Then('these data will not pass createTask validation', function () {
    const validate = ajv.compile(createTaskSchema);
    const isValid = validate(this.taskData);
    if (!isValid) {
        const validationError = ajv.errorsText(validate.errors, { separator: ' ' });
        this.validationError = validationError
    }
})

Then('I receive validation error message {}', function (expectedMessage) {
    const messageRecieved = this.validationError
    if (messageRecieved !== expectedMessage) {
        throw new Error(`Expected: ${expectedMessage}, but received ${messageRecieved}`);
    }
});

//------------------------------------------------------------------
When('use failed method POST', async function () {
    try {
        await axios.post(this.url, this.taskData);


    } catch (error) {
        this.error = error.response
    }
});

Then('I receive the message {string}', function (expectedMessage) {
   
    const messageRecieved = this.error.data
    if (messageRecieved !== expectedMessage) {
        throw new Error(`Expected: ${expectedMessage}, but received ${messageRecieved}`);
    }
});

//-----------------------------------------------------------------------------


Then('these data will not pass updateTask validation', function () {
    const validate = ajv.compile(updateTaskSchema);
    const isValid = validate(this.taskData);
    if (!isValid) {
        const validationError = ajv.errorsText(validate.errors, { separator: ' ' });
        this.validationError = validationError
    }
})

//---------------------------------------------------------------------------------
When('use failed method PUT', async function () {
    try {
        await axios.put(this.url, this.taskData);


    } catch (error) {
        this.error = error.response
    }
  });
