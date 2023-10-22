Feature: Create Task API

  Scenario: Successfully Create a Task
    

    Given the API endpoint for creating tasks

    When a POST request is made to create a new task with the following data:
      | title        | Task Title    |
      | description  | Task Description |
      | category     | Category Name |
    Then the response status code should be 201
    And the response should contain the created task details


