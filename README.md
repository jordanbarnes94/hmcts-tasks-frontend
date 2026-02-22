# HMCTS Task Management Frontend

A Node.js/Express frontend application for the HMCTS Task Management System, built with TypeScript, Nunjucks templating, and GOV.UK Design System components.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Yarn package manager
- Backend API running on `http://localhost:4000`

### Installation & Running

```bash
# Install dependencies
yarn install

# Build frontend assets (webpack compilation)
yarn build

# Start development server with hot reload
yarn start:dev
```

The application will be available at `http://localhost:3100` (or the configured port).

### Configuration

The app reads configuration from `config/development.json` in development mode:

```json
{
  "api": {
    "baseUrl": "http://localhost:4000",
    "basePath": "/api"
  }
}
```

### What Does Webpack Do?

Webpack is the **module bundler** that:

- **Compiles TypeScript to JavaScript** — Transpiles `.ts` files to browser-compatible JS
- **Bundles dependencies** — Packages `node_modules` imports into optimised bundles
- **Processes assets** — Handles SCSS compilation, images, fonts
- **Enables hot reload** — Watches for file changes in development
- **Minifies for production** — Compresses code for optimal performance

## Project Structure

```
src/main/
├── routes/                   # Express route handlers
│   ├── home.ts               # GET / — Task list with search, filters & pagination
│   └── tasks/
│       ├── create.ts         # GET /tasks/new, POST /tasks
│       ├── view.ts           # GET /tasks/:id
│       ├── edit.ts           # GET /tasks/:id/edit, POST /tasks/:id
│       └── delete.ts         # GET /tasks/:id/delete, POST /tasks/:id/delete
│
├── services/
│   └── TaskService.ts        # All backend API calls (searchTasks, getTaskById,
│                             #   createTask, updateTask, deleteTask)
│
├── modules/
│   ├── api.ts                # Axios HTTP client wrapper (get/post/put/del)
│   ├── config.ts             # Config module initialisation
│   └── nunjucks/             # Nunjucks template engine setup
│
├── utils/
│   ├── dateHelper.ts         # parseGovUkDate, extractDateComponents,
│   │                         #   formatDate, formatDateTime
│   ├── errorHandler.ts       # classifyAxiosError — typed Axios error classifier
│   ├── flash.ts              # redirectWithFlash — POST-Redirect-GET flash messages
│   ├── queryParser.ts        # extractTaskSearchParams — parse URL query into API params
│   └── validationErrors.ts   # validateTaskForm, constructErrors
│
├── types/
│   ├── task.ts               # Task, TaskStatus, STATUS_OPTIONS, PageResponse,
│   │                         #   CreateTaskRequest, UpdateTaskRequest,
│   │                         #   TaskSearchParams, formatTask
│   └── govuk-frontend.d.ts   # GOV.UK component type declarations
│
├── views/
│   ├── home.njk              # Task list page with search, filters & pagination
│   ├── template.njk          # Base layout template
│   ├── error.njk             # Generic error page
│   ├── not-found.njk         # 404 page
│   ├── forbidden.njk         # 403 page (CSRF failure)
│   ├── tasks/
│   │   ├── _form.njk         # Shared create/edit form partial
│   │   ├── new.njk           # Create task form
│   │   ├── view.njk          # View single task with summary list
│   │   ├── edit.njk          # Edit task form
│   │   └── delete.njk        # Delete confirmation page
│   └── macros/
│       ├── flash.njk         # GOV.UK notification banner macro
│       └── csrf.njk          # CSRF hidden input macro
│
├── assets/
│   ├── scss/                 # Stylesheets
│   └── js/                   # Client-side JavaScript entry point
│
├── public/                   # Built assets (webpack output)
├── app.ts                    # Express app setup
└── server.ts                 # Server entry point
```

## Architecture & Design Decisions

### 1. Frontend-Backend Separation

The frontend is a separate Express.js application that communicates with the backend via REST API.

- **Separation of concerns** — UI logic separated from business logic
- **Independent scaling** — Frontend and backend can scale independently
- **Technology flexibility** — Could swap frontend framework without touching backend

### 2. Server-Side Rendering with Nunjucks

Nunjucks templates are used for server-side rendering instead of a client-side framework (React/Vue/Angular).

- **Progressive enhancement** — Works without JavaScript
- **GOV.UK compatibility** — GOV.UK Design System provides Nunjucks components
- **Accessibility** — Server-rendered HTML is more accessible by default
- **Appropriate for the domain** — Form-heavy government services suit SSR well

### 3. GOV.UK Design System

GOV.UK Design System patterns and components are used throughout.

- **Consistency** — Familiar interface for UK government service users
- **Accessibility** — WCAG 2.1 AA compliant out of the box
- **Proven patterns** — Battle-tested form patterns and error handling

Key patterns used:

- [Summary lists](https://design-system.service.gov.uk/components/summary-list/) — Task detail view
- [Question pages](https://design-system.service.gov.uk/patterns/question-pages/) — Create/edit forms
- [Pagination](https://design-system.service.gov.uk/components/pagination/) — Task list navigation
- [Notification banner](https://design-system.service.gov.uk/components/notification-banner/) — Flash messages
- [Error summary](https://design-system.service.gov.uk/components/error-summary/) — Form validation errors

### 4. POST-Redirect-GET Pattern

After form submissions (POST), the app redirects to a GET endpoint showing the result. Flash messages are passed as query parameters.

**Example create flow:**

1. User submits create task form → `POST /tasks`
2. Backend creates task
3. Frontend calls `redirectWithFlash(res, '/tasks/:id', 'Task created successfully')`
4. Browser follows redirect → `GET /tasks/:id?flashMessageText=...&flashMessageType=success`
5. User sees the task with a green success notification banner

This prevents duplicate submissions if the user refreshes, keeps URLs clean, and makes the back button work correctly.

### 5. Centralised Error Handling

All Axios errors are classified through a single shared utility rather than repeating `isAxiosError` checks in every route:

```typescript
// utils/errorHandler.ts
export function classifyAxiosError(error: unknown): AxiosErrorResult {
  // Returns: { status: 404 } | { status: 400, validationErrors, message } | { status: 'other' }
}

// In any route:
const result = classifyAxiosError(error);
if (result.status === 404) return res.status(404).render('not-found');
if (result.status === 400) { /* re-render form with errors */ }
```

### 6. Date Handling

The GOV.UK Date Input component sends day/month/year as separate fields. Dedicated utilities handle conversion:

```typescript
// Parsing user input → ISO string for backend:
parseGovUkDate('15', '3', '2026') // → '2026-03-15T00:00:00'

// Extracting components for pre-populating edit form:
extractDateComponents('2026-03-15T00:00:00') // → { day: '15', month: '3', year: '2026' }

// Formatting for display:
formatDate('2026-03-15T00:00:00')     // → '15 March 2026'
formatDateTime('2026-03-15T10:30:00') // → '15 March 2026, 10:30:00'
```

Both `formatDate` and `formatDateTime` explicitly pass `timeZone: 'UTC'` and append `Z` to the input string to prevent local-timezone drift.

### 7. Form Validation Strategy

Validation runs in two layers:

1. **Client-side (before API call)** — `validateTaskForm()` checks required fields and date range validity (day 1–31, month 1–12, 4-digit year, real calendar date). Returns field-keyed error messages for immediate feedback.

2. **Backend 400 response** — If the API returns validation errors, `constructErrors()` maps them to the same field-keyed format and re-renders the form with user input preserved.

In both cases, the form is re-rendered (not redirected) so the user never loses their input.

### 8. CSRF Protection

All POST forms are protected via `csurf` middleware. Each route handler injects `csrfToken: req.csrfToken()` into the template context, which is rendered as a hidden input via the `csrf.njk` macro. Invalid CSRF tokens result in a 403 response rendering `forbidden.njk`.

### 9. Enum Synchronisation (Status Values)

`TaskStatus` values and their display labels are defined once in `src/main/types/task.ts` and reused everywhere — filter dropdowns, edit form selects, and display formatting — via the `STATUS_OPTIONS` constant:

```typescript
export const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING,     text: 'Pending' },
  { value: TaskStatus.IN_PROGRESS, text: 'In Progress' },
  { value: TaskStatus.COMPLETED,   text: 'Completed' },
] as const;
```

## Status Display Values

| Backend Value | Display      | Usage                 |
| ------------- | ------------ | --------------------- |
| `PENDING`     | Pending      | Newly created tasks   |
| `IN_PROGRESS` | In Progress  | Tasks being worked on |
| `COMPLETED`   | Completed    | Finished tasks        |

## Testing

```bash
# Run unit tests
yarn test:unit

# Run route tests
yarn test:routes

# Run functional tests
yarn test:functional

# Run with coverage
yarn test:coverage
```

## Linting & Formatting

```bash
# Lint code
yarn lint

# Auto-fix issues
yarn lint:fix
```

The project uses:

- **ESLint** for JavaScript/TypeScript linting
- **Stylelint** for SCSS linting
- **Prettier** for consistent code formatting
- **Husky** for pre-commit hooks

## Production Build

```bash
# Build optimised production assets
yarn build:prod

# Run in production mode
yarn start
```

## Available Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `yarn start`           | Run in production mode             |
| `yarn start:dev`       | Run with nodemon hot reload        |
| `yarn build`           | Build development assets           |
| `yarn build:prod`      | Build optimised production assets  |
| `yarn lint`            | Lint all code                      |
| `yarn lint:fix`        | Auto-fix linting issues            |
| `yarn test:unit`       | Run unit tests                     |
| `yarn test:routes`     | Run route tests                    |
| `yarn test:functional` | Run functional/E2E tests           |
| `yarn test:coverage`   | Run tests with coverage report     |

## API Integration

The frontend communicates with the backend API at `http://localhost:4000/api` (configurable via `config/development.json`).

**Endpoints used:**

| Method   | Path                  | Usage                           |
| -------- | --------------------- | ------------------------------- |
| `GET`    | `/api/tasks`          | Paginated task list with search/filters |
| `POST`   | `/api/tasks`          | Create new task                 |
| `GET`    | `/api/tasks/:id`      | Fetch single task               |
| `PUT`    | `/api/tasks/:id`      | Update task (title, description, due date, status) |
| `DELETE` | `/api/tasks/:id`      | Delete task                     |

**Search/filter parameters supported on `GET /api/tasks`:**

- `search` — Partial title match
- `status` — Filter by `PENDING`, `IN_PROGRESS`, or `COMPLETED`
- `dueDateFrom` / `dueDateTo` — Date range filter
- `page` / `size` — Pagination

## Known Limitations

- **Structured logging** — Routes use `console.error` for error logging. A production service would use a structured logging library (e.g. `pino` or `winston`) with log levels and request correlation IDs.
- **Route registration order** — Routes are glob-loaded and sorted alphabetically, so registration order depends on filenames. This is documented in `app.ts` but warrants care if new route files are added.
- **No client-side JavaScript enhancements** — Validation and interactions are server-side only. Client-side validation could be added for faster feedback without sacrificing the server-side fallback.

## Additional Resources

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Express.js Documentation](https://expressjs.com/)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
