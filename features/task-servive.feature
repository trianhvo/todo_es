@task-service
Feature: Task Service
  In order to manage tasks
  I want to make sure CRUD operations through REST API works fine

@createTaskTest
  Scenario Outline: create a task
    Given A task's data <taskData>
    When I send POST request to create new task
    Then I validate the input data against the createTask schema
    And I verify that the API has been called
    And I get response status code 201
    And I verify the output matches the created task
    And I delete the task and confirm it's deleted

    Examples:
      | taskData                                                                                             |
      | {"category": "testing", "id": 1, "title": "testing title", "description": "testing description"}     |
      # | {"category": "testing", "id": 2, "title": "testing title 2", "description": "testing description 2"} |
      # | {"category": "testing", "id": 3, "title": "testing title 3", "description": "testing description 3"} |