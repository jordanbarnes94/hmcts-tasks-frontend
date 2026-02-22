Feature: Delete a task

    Scenario: The delete confirmation page shows the task details and a warning
        Given I go to '/tasks/new'
        And I fill in 'Title' with 'Task To Delete'
        And I fill in 'dueDate-day' with '20'
        And I fill in 'dueDate-month' with '4'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        When I click 'Delete task'
        Then the page should include 'Delete task'
        And the page should include 'This action cannot be undone.'
        And the page should include 'Are you sure you want to delete this task?'
        And the page should include 'Task To Delete'

    Scenario: Cancelling deletion returns to the task view page
        Given I go to '/tasks/new'
        And I fill in 'Title' with 'Task Not Deleted'
        And I fill in 'dueDate-day' with '20'
        And I fill in 'dueDate-month' with '4'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        When I click 'Delete task'
        And I click 'Cancel'
        Then the page should include 'Task Not Deleted'
        And the page URL should contain '/tasks/'

    Scenario: Confirming deletion removes the task and shows a success message
        Given I go to '/tasks/new'
        And I fill in 'Title' with 'Task For Deletion'
        And I fill in 'dueDate-day' with '20'
        And I fill in 'dueDate-month' with '4'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        When I click 'Delete task'
        And I click 'Delete task'
        Then the page should include 'Task deleted successfully'
        And the page URL should be '/'
