const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios'); // Require Axios


let apiResponse;



Given('the API endpoint for creating tasks', function () {
  // Set the API endpoint for creating tasks
   apiEndpoint = 'http://localhost:3000/tasks';
});

When('a POST request is made to create a new task with the following data:', async function (table) {
  const requestData = {
    category: "school",
    id: 200,
    title: "title",
    description: "",
    status: "in progress"
};
  
  // Send a POST request to the API endpoint with the provided data
  try {
    
    const response = await axios.post(apiEndpoint, requestData);
   
    apiResponse = response;
  } catch (error) {
    apiResponse = error.response;
  }
});

Then('the response status code should be {int}', function (expectedStatusCode) {
  
  const actualStatusCode = apiResponse.status;
  if (actualStatusCode !== expectedStatusCode) {
    throw new Error(`Expected status code ${expectedStatusCode}, but received ${actualStatusCode}`);
  }
});


  