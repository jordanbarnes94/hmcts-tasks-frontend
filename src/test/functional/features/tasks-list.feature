Feature: Task list

    Scenario: The task list page shows the correct headings
        When I go to '/'
        Then the page should include 'Task Management'
        And the page should include 'Filter tasks'
        And the page should include 'Add new task'

    Scenario: The filter form contains all expected fields
        When I go to '/'
        Then the page should include 'Search'
        And the page should include 'Status'
        And the page should include 'Due after'
        And the page should include 'Due before'
        And the page should include 'Apply filters'

    Scenario: Clicking 'Add new task' goes to the create task page
        When I go to '/'
        And I click 'Add new task'
        Then the page should include 'Create a task'
        And the page URL should contain '/tasks/new'
