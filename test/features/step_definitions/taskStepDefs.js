
/*the {} use to extract data at exactly position of the sentence in feature file, but
1. The value in feature must in "one" or <many>
2. This will auto go to param of function right next to it, this mean function MUST HAVE PARAM if want to use the extract way, if not, need to manually declare in this fucntion
3. this. use to make variable global to use in others steps


*/

const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const Ajv = require('ajv');
const createTaskSchema = require('../../../src/validation/taskSchema').createTaskSchema;
const { expect } = require('chai');
require('dotenv').config()
const testConfig = require('../../../src/config/test-config');

console.log('.......test_env.......', process.env.NODE_ENV)
const ajv = new Ajv();
const testIndex = testConfig.elasticsearch.index;

let apiResponse;
let createdTaskId;

Given('A task\'s data {}', function (taskData) {
  this.taskData = JSON.parse(taskData);
  this.taskData.index = testIndex;
  // Clear any previous createdTaskId
  createdTaskId = undefined;
});

When('I send POST request to create new task', async function () {
  const url = 'http://localhost:3000/tasks';
  try {
    const response = await axios.post(url, this.taskData);
    apiResponse = response;
    createdTaskId = response.data.task._id; // Assuming the created task ID is stored in the response
  } catch (error) {
    apiResponse = error.response;
  }
});

Then('I validate the input data against the createTask schema', function () {
  const validate = ajv.compile(createTaskSchema);
  const isValid = validate(this.taskData);

  if (!isValid) {
    const validationError = ajv.errorsText(validate.errors, { dataVar: 'taskData' });
    throw new Error(`Input data validation failed: ${validationError}`);
  }
});

Then('I verify that the API has been called', function () {
  if (!apiResponse) {
    throw new Error('API call did not happen');
  }
});

Then('I get response status code {int}', function (expectedStatusCode) {
  const actualStatusCode = apiResponse.status;
  if (actualStatusCode !== expectedStatusCode) {
    throw new Error(`Expected status code ${expectedStatusCode}, but received ${actualStatusCode}`);
  }
});

Then('I verify the output matches the created task', function () {
  const expectedTaskData = {
    message: 'Task created.',
    task: {
      id: createdTaskId, // Use the ID created in the POST request
      title: this.taskData.title,
      description: this.taskData.description,
      status: 'not started'
    }
  };

  try {
    expect(apiResponse.data).to.deep.equal(expectedTaskData);
  } catch (error) {
    throw new Error(`Output does not match the created task: ${error.message}`);
  }
});

Then('I delete the task and confirm it\'s deleted', async function () {
  if (createdTaskId) {
    const url = `http://localhost:3000/tasks/${this.taskData.category}/${createdTaskId}`;
    try {
      const response = await axios.delete(url);
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`Failed to delete the task: ${error.message}`);
    }
  } else {
    throw new Error('No task was created to delete.');
  }
});
