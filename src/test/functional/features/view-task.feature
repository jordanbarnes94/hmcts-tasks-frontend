Feature: View a task

    Scenario: Task details are shown on the view page after creation
        Given I go to '/tasks/new'
        And I fill in 'Title' with 'View Test Task'
        And I fill in 'Description' with 'View test description'
        And I fill in 'dueDate-day' with '15'
        And I fill in 'dueDate-month' with '6'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        Then the page should include 'View Test Task'
        And the page should include 'View test description'
        And the page should include 'Description'
        And the page should include 'Status'
        And the page should include 'Due date'

    Scenario: The task view page shows action buttons and a back link
        Given I go to '/tasks/new'
        And I fill in 'Title' with 'Action Button Test Task'
        And I fill in 'dueDate-day' with '15'
        And I fill in 'dueDate-month' with '6'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        Then the page should include 'Edit task'
        And the page should include 'Delete task'
        And the page should include 'Back to task list'
