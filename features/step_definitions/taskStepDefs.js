const { Given, When, Then } = require('@cucumber/cucumber');
const { errors } = require('@elastic/elasticsearch');
const axios = require('axios');
const Ajv = require('ajv');
const createTaskSchema = require('../../src/validation/taskSchema').createTaskSchema;
const { expect } = require('chai');

const ajv = new Ajv();
let apiResponse

/*the {} use to extract data at exactly position of the sentence in feature file, but
1. The value in feature must in "one" or <many>
2. This will auto go to param of function right next to it, this mean function MUST HAVE PARAM if want to use the extract way, if not, need to manually declare in this fucntion
3. this. use to make variable global to use in others steps


*/
Given('A task\'s data {}', function (taskData) {
this.taskData = JSON.parse(taskData);
});

When('I send POST request to create new task', async function () {
const url = 'http://localhost:3000/tasks';
try {
const response = await axios.post(url, this.taskData);
apiResponse = response;
// console.log('aaaaaaaaaaaaaaaaaaaaaaaa', apiResponse)
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
 
  expectedTaskData = {
    message: 'Task created',
    task: {
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
  // Delete the task with the stored category and id
  const url = `http://localhost:3000/${this.taskData.category}/${this.taskData.id}`;
  try {
    const response = await axios.delete(url);
    expect(response.status).to.equal(200);
  } catch (error) {
    throw new Error(`Failed to delete the task: ${error.message}`);
  }
});