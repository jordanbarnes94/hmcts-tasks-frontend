Feature: Create a task

    Scenario: The create task page loads with the expected form fields
        When I go to '/tasks/new'
        Then the page should include 'Create a task'
        And the page should include 'Title'
        And the page should include 'Description'
        And the page should include 'Due date'

    Scenario: Validation error when the form is submitted empty
        When I go to '/tasks/new'
        And I click 'Create task'
        Then the page should include 'There is a problem'
        And the page should include 'Enter a title'
        And the page should include 'Enter a due date'

    Scenario: Validation error when title is provided but due date is missing
        When I go to '/tasks/new'
        And I fill in 'Title' with 'My test task'
        And I click 'Create task'
        Then the page should include 'There is a problem'
        And the page should include 'Enter a due date'

    Scenario: Validation error when an impossible date is entered
        When I go to '/tasks/new'
        And I fill in 'Title' with 'My test task'
        And I fill in 'dueDate-day' with '31'
        And I fill in 'dueDate-month' with '2'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        Then the page should include 'There is a problem'
        And the page should include 'Enter a real due date'

    Scenario: Successfully creating a task redirects to the task detail page
        When I go to '/tasks/new'
        And I fill in 'Title' with 'Functional Test Task'
        And I fill in 'Description' with 'Created by functional test'
        And I fill in 'dueDate-day' with '1'
        And I fill in 'dueDate-month' with '6'
        And I fill in 'dueDate-year' with '2026'
        And I click 'Create task'
        Then the page should include 'Task created successfully'
        And the page should include 'Functional Test Task'
        And the page URL should contain '/tasks/'
