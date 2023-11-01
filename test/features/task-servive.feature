@task-service
Feature: Task Service
In order to manage tasks
I want to make sure CRUD operations through REST API works fine

@createTaskTest
Scenario Outline: create a task
Given A task's data from ".json"
Then I validate the input data against the createTask schema
When I send POST request to create a new task
Then I verify that the API has been called
And I get response status code 201
And I verify the output matches the data from "test/data/createRes.json"
And I delete the task and confirm it's deleted