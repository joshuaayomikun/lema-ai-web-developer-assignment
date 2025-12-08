# Web Developer Assignment

A full-stack user management system with a Node.js/SQLite backend and React/TypeScript frontend. Users are displayed in a paginated table, and clicking on a user shows their posts with the ability to create and delete posts.

## 🌐 Live Demo

- **Frontend**: https://lema-ai-frontend-coding-test-60f713aaccb2.herokuapp.com/
- **Backend API**: https://lema-ai-backend-coding-test-cee986ff7bb8.herokuapp.com/

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x
- **pnpm** 10.x

### Installation

```bash
# Clone the repository
git clone https://github.com/joshuaayomikun/lema-ai-web-developer-assignment.git
cd lema-ai-web-developer-assignment

# Install dependencies
pnpm install
```

### Database Setup

The SQLite database (`data.db`) is pre-configured and included in the repository. No migrations are required.

### Running the Application

**Option 1: Run both servers concurrently**
```bash
pnpm dev
```

**Option 2: Run servers separately**

In one terminal (Backend - http://localhost:3000):
```bash
pnpm backend:dev
```

In another terminal (Frontend - http://localhost:4200):
```bash
pnpm frontend:dev
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run backend tests only
pnpm backend:test

# Run frontend tests only
pnpm frontend:test
```

## 📁 Project Structure

This project uses an **Nx monorepo** with pnpm for package management, structured with feature-based architecture:

```
web-developer-assignment/
├── apps/
│   ├── backend/              # Express.js API server
│   │   ├── src/
│   │   │   ├── db/           # Database queries and types
│   │   │   └── routes/       # API route handlers
│   │   ├── config/           # Configuration files
│   │   ├── project.json      # Nx project configuration
│   │   └── tsconfig.json
│   │
│   └── frontend/             # React application
│       ├── src/
│       │   ├── features/     # Feature modules (users, posts)
│       │   ├── app/          # App shell and routing
│       │   └── lib/          # API client
│       ├── project.json      # Nx project configuration
│       ├── vite.config.mts   # Vite configuration
│       └── tsconfig.json
│
├── libs/
│   ├── ui/                   # Shared React UI components
│   │   ├── src/lib/          # Button, Modal, etc.
│   │   └── project.json
│   └── shared/               # Shared utilities
│
├── dist/                     # Build outputs
├── .nx/                      # Nx cache
├── nx.json                   # Nx workspace configuration
├── tsconfig.base.json        # Shared TypeScript config
├── pnpm-workspace.yaml       # pnpm workspace definition
└── package.json              # Root workspace scripts
```

### Why Nx Monorepo?

**Benefits:**
- **Smart Caching**: Nx only rebuilds what changed, dramatically speeding up builds
- **Code Sharing**: Share components (`libs/ui`) across projects without publishing packages
- **Parallel Execution**: Run tasks across multiple projects simultaneously
- **Dependency Graph**: Visualize relationships between projects with `pnpm exec nx graph`
- **Affected Commands**: Only test/build projects affected by your changes

## 🔌 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users?pageNumber=0&pageSize=4` | Get paginated users with address |
| GET | `/users/count` | Get total user count |
| GET | `/users/:id` | Get user by ID |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts?userId={id}` | Get posts for a user |
| POST | `/posts` | Create a new post |
| DELETE | `/posts/:id` | Delete a post |

## ✅ Implemented Features

### Backend
- ✅ User endpoints with address data (JOIN query)
- ✅ Post creation endpoint with validation
- ✅ Post deletion endpoint
- ✅ Health check endpoint
- ✅ CORS configuration
- ✅ Unit tests (19 tests)

### Frontend
- ✅ Users table with pagination (4 per page)
- ✅ Address formatting with ellipsis overflow
- ✅ User posts page with create/delete functionality
- ✅ New post modal with form validation
- ✅ Loading and error states
- ✅ React Query for data fetching/caching
- ✅ TailwindCSS v4 styling
- ✅ Unit tests (14 tests)

## 🛠️ Development Notes

### Technology Stack

**Backend:**
- Node.js 18.x with TypeScript
- Express.js for API server
- SQLite3 for database
- Vitest for testing

**Frontend:**
- React 19 with TypeScript
- Vite 5.x for bundling
- React Router for navigation
- React Query (@tanstack/react-query) for data fetching
- TailwindCSS v4 for styling
- Vitest + Testing Library for testing

**Tooling:**
- Nx 22.1.2 for monorepo management
- pnpm 10.x for package management
- Prettier for code formatting

### Available Commands

```bash
# Development
pnpm dev                  # Run both apps concurrently
pnpm backend:dev          # Run backend only
pnpm frontend:dev         # Run frontend only

# Build
pnpm build                # Build both apps
pnpm backend:build        # Build backend only
pnpm frontend:build       # Build frontend only

# Testing
pnpm test                 # Run all tests
pnpm backend:test         # Run backend tests only
pnpm frontend:test        # Run frontend tests only

# Nx-specific commands
pnpm exec nx graph                    # Visualize project dependencies
pnpm exec nx show projects            # List all projects
pnpm exec nx reset                    # Clear Nx cache
pnpm exec nx affected:test            # Test only affected projects
```

### Package Management with pnpm

This project uses **pnpm** with a hoisted node_modules structure (configured in `.npmrc`):
- `node-linker=hoisted` - Creates a flat structure for Nx compatibility
- `shamefully-hoist=true` - Makes all packages accessible across the monorepo
- `ignore-scripts=false` - Allows lifecycle scripts to run

These settings ensure Nx and its plugins work correctly while maintaining the benefits of pnpm's fast, disk-efficient installations.

### Adding Backend Dependencies

When adding new npm packages to the backend, you must also update the Heroku deployment workflow. The deployment creates its own `package.json` with explicit dependencies.

**Steps:**
1. Add the package normally: `pnpm add <package-name>`
2. Update `.github/workflows/deploy-backend.yml` - find the `package.json` section and add your new dependency there

### Security Features

The application includes the following security measures:

**Backend:**
- Helmet.js for secure HTTP headers
- Rate limiting (100 requests per 15 min per IP)
- Request body size limit (10kb)
- Environment-based CORS (production restricts to frontend domain)

**Frontend:**
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Strict referrer policy

---

## Original Assignment Requirements

## Backend

### Provided Backend

A Node server written in TypeScript is provided.
The server utilizes an SQLite database (data.db) containing all relevant data, including users posts and addresses.
The server exposes several partial RESTful API endpoints:

User Endpoints:
- `GET /users` -  Returns a list of users with pagination support. (e.g., /users?pageNumber=0&pageSize=10).
- `GET /users/count` - Returns the total number of users.
Post Endpoint:
- `GET /posts` - Returns posts filtered by a specific user ID, using the userId query parameter (e.g., /posts?userId={userId}).

### Backend Requirements

You are required to implement the following backend functionalities:

- **Address to User**
  - Extend the existing user-related endpoints to include address (metadata associated with the user).
  - Query the address from the database and include them in the user response.
  - Ensure the address are properly validated and formatted before returning to the frontend.
- **Post Deletion**
  - Create an endpoint to delete a post by its ID.
  - Remove the post from the database upon successful deletion.
  - Return appropriate HTTP status codes and messages.
- **Add a New Post**
  - Create an endpoint to add a new post for a user, accepting **Title**, **Body**, and **User ID**.
  - Validate input data and handle errors.
  - Save the new post to the database upon success.

## Front-End

### General Requirements

- Implement the web UI using **TypeScript**, **React**, **React Query**, and **Tailwind CSS**.
- Follow the **Tailwind** and **shadcn/ui** design tokens (defined in Figma) for consistent styling.
- Follow the **Figma design** provided in the Resources section.
- Ensure **graceful handling of API errors** or unexpected data from the backend.
- Components and pages should have **error and loading states**.
- Emphasize **code reusability** and **separation of concerns** in your components.

### Users Table

- Set up an internal API that fetches a list of users from your backend API, using the pagination.
- Display the users in an organized table with the following features:
  - **Pagination**: Show 4 users per page.
  - **User Details**:
    - Full Name
    - Email Address
    - Address formatted as "street, state, city, zipcode". Keep the address column at 392px width and use ellipsis (...) for any overflow.

### User Posts

- When clicking on a user row, navigate to a new page that displays a list of the user's posts.
- Fetch the user's posts from your backend API.
- The page should include:
  - A header with a summary of the user and the number of posts.
  - A list of all posts (**no pagination required**).
  - Each post should display:
    - **Title**
    - **Body**
    - A **Delete** icon.
      - Clicking the Delete icon should delete the post via your backend API and update the UI accordingly.
  - An option to **add a new post**:
    - Include a button that opens a form to create a new post with **Title** and **Body** fields.
    - Upon submission, the new post should be saved via your backend API and appear in the list of posts without requiring a page refresh.
- Ensure the design is intuitive and posts are easily readable by closely following the provided Figma design.

## Guidelines

1. **State Management with React Query**
   - Use React Query to manage server state.
   - Ensure efficient data fetching, caching, and synchronization with the backend.
   - Utilize React Query's features to handle loading and error states.
2. **Code Reusability and Separation**
   - Structure your components to promote reusability and maintainability.
   - Abstract shared logic into custom hooks or utility functions where appropriate.
   - Follow best practices for component composition and props management.
3. **Responsiveness**
   - Ensure the application is responsive and functions well on various screen sizes and devices.
   - Use Tailwind CSS utilities to create responsive layouts.
4. **Error Handling**
   - Implement robust error handling for API requests and unexpected data.
   - Provide meaningful feedback to the user in case of errors.
   - Use try-catch blocks and handle promise rejections appropriately in your backend.

## Resources

- **Backend Server**: A partially implemented Node server in TypeScript will be provided. You are expected to complete the specified backend functionalities.
- **SQLite Database**: The backend uses the `data.db` SQLite database, which contains all necessary data.
- **Figma Design**: Follow the design specifications outlined in the provided Figma file.
  [Figma Design for Web UI](https://www.figma.com/design/Wkbz27sGWBOFMDocOck4mm/Full-Stack-Developer-Assignment?node-id=0-1&node-type=canvas&t=zK4X8qKaPmxu84XZ-0)

## Deliverables

- A full-stack application that meets the above requirements.
- Source code organized and documented for readability.
- Completed backend functionalities as specified.
- At least one unit test demonstrating testing of a component or functionality.
- Instructions on how to run the application locally, including setting up the backend and frontend.

## Submission Instructions

- **Code Repository**: Provide access to your code via a Git repository (e.g., GitHub, GitLab).
- **Readme File**: Include a `README.md` file with instructions on how to install dependencies, set up the database, run migrations (if any), and start both the backend and frontend servers.
