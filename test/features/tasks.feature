Feature: Tasks API Test

@getTask
Scenario Outline: test GET API to retrieve existed task 


Given index todos_test with a dataset
And path url method "GET" with task ID <id>
When use method GET
Then I get response status code 200
And I verify the output's title matches <title>
And I drop mapping

Examples:
|id |title|
|1 |Write a blog|
|2 |Develop new marketing campaign|
|3 |Analyze customer data |





@createTask
Scenario Outline: test POST API to create new task

Given index todos_test with a dataset
And path url method POST
And task data from json file <create_req JSON file>
Then these data pass createTask validation
When use method POST
Then I get response status code 201
And result's id matches <id>
And I drop mapping

Examples:
|create_req JSON file |id |
|create_req_100.json |100 |



@updateTask
Scenario Outline: test PUT API to update existed task

Given index todos_test with a dataset
And path url method "PUT" with task ID <id>
And task data from json file <updated_req JSON file>
Then task existed
And these data pass updateTask validation
When use method PUT
Then I get response status code 200
And result's status matches <status>
And I drop mapping

Examples:
|id|updated_req JSON file  |status |
|1 |updated_req_01.json |Completed |

@deleteTask
Scenario Outline: test DELETE API to delete existed task 

Given index todos_test with a dataset
And path url method "DELETE" with task ID <id>
When use method DELETE
Then I get response status code 200
And I drop mapping

Examples:
|id |
|1 |
|2 |
|3 |


@searchTask
Scenario Outline: test GET API to search existed tasks

Given index todos_test with a dataset
And path url to search
And task data from json file <search_req json file>
When use api search task
Then I get response status code 200
And result matches data in <search_res json file>
And I drop mapping

Examples:
|search_req json file |search_res json file|
|search_req_01.json |search_res_01.json |

# -----------------------------------------------------------------------

@getTaskError
Scenario Outline: test GET API error handling 

Given index todos_test with a dataset
And path url method "GET" with non-existent task ID <id>
When use failed method GET
Then I get response error status code 404
And I receive message "Task not found!"
And I drop mapping

Examples:
|id |
|100 |
|200 |
|300 |



@createTaskError1
Scenario Outline: test POST API to create new task, but invalid input
    Error handling when input invalid: 
        - 01: datatype error
        - 02: length error
        - 03: format error
        - 04: missing required property
        - 05: redundant property


Given index todos_test with a dataset
And path url method POST
And task data from json file <invalid_create_req JSON file>
Then these data will not pass createTask validation
And I receive validation error message <message>
And I drop mapping

Examples:
|invalid_create_req JSON file |message|
|invalid_create_req_01.json |data.category should NOT be shorter than 2 characters|
|invalid_create_req_02.json |data.id should be number|
|invalid_create_req_03.json |data.dueDate should match format "date"|
|invalid_create_req_04.json |data should have required property 'category'|
|invalid_create_req_05.json |data should NOT have additional properties|


@createTaskError2
Scenario Outline: test POST API to create new task, but task exists

Given index todos_test with a dataset
And path url method POST
And task data from json file <exists_create_req JSON file>
When use failed method POST
Then I get response error status code 400
And I receive the message "Task already exists!"
And I drop mapping

Examples:
|exists_create_req JSON file |
|exists_create_req_01.json |




@updateTaskError1
Scenario Outline: test PUT API to update exists task, but invalid input
    Error handling when input invalid: 
        - 01: datatype error
        - 02: length error
        - 03: format error
        - 04: missing required property
        - 05: redundant property
        - 06: not included in list of enum value


Given index todos_test with a dataset
And path url method "PUT" with task ID <id>
And task data from json file <invalid_update_req JSON file>
Then these data will not pass updateTask validation
And I receive validation error message <message>
And I drop mapping

Examples:
|id |invalid_update_req JSON file |message|
|1 |invalid_update_req_01.json |data.category should NOT be shorter than 2 characters|
|1 |invalid_update_req_02.json |data.title should be string|
|1 |invalid_update_req_03.json |data.dueDate should match format "date"|
|1 |invalid_update_req_05.json |data should NOT have additional properties|
|1 |invalid_update_req_06.json |data.status should be equal to one of the allowed values|

# -------------------------------

@updateTaskError2
Scenario Outline: test PUT API to update exists task, but task not exists

Given index todos_test with a dataset
And path url method "PUT" with task ID <id>
When use failed method PUT
Then I get response error status code 400
And I receive message "Task not found!"
And I drop mapping

Examples:
|id |
|10 |
|20 |
|30 |




@deleteTaskError
Scenario Outline: test DELETE API error handling 

Given index todos_test with a dataset
And path url method "DELETE" with non-existent task ID <id>
When use failed method DELETE
Then I get response error status code 404
And I receive message "Task not found!"
And I drop mapping
Examples:
|id |
|100 |
|200 |
|300 |
