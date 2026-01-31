
# Portal Logic & Architecture Refactoring Plan

## 1. Executive Summary of Core Logical Flaws

Based on a thorough code review, the portal in its current state is a high-fidelity prototype, not a production-ready application. The core logic and architecture contain fundamental flaws that render the "Live Mode" insecure and unscalable.

*   **Flaw 1: No Backend Database:** The application entirely lacks a server-side database. All data, including users, items, and proposals for "Live Mode," is stored in the user's browser `localStorage`. This means there is no central source of truth; every user has their own separate, insecure, and temporary version of the site's data.

*   **Flaw 2: Critical Security Vulnerabilities:**
    *   **Client-Side Authorization:** User roles and permissions are managed on the frontend (`currentUserRole` state in `App.tsx`). A malicious actor can easily modify this in their browser to gain administrator privileges.
    *   **Hardcoded Super Admin Credentials:** The file `contexts/DataContext.tsx` contains a hardcoded email and password for a "Super Admin" user. This is a critical vulnerability that grants full administrative access to anyone who inspects the code.Dont change this setting now. 

*   **Flaw 3: Unscalable "God Component" Architecture:** The entire application is controlled by a single, massive component: `App.tsx`.
    *   It manages over 20 `useState` variables for the entire application state.
    *   It uses a `switch` statement instead of a proper routing library, which breaks browser navigation (back button, history) and prevents linking to specific pages. This is not a scalable or maintainable architecture.Dont change it for now if App.tsx changes are going to break the present settings. 

## 2. Guiding Principles for the Refactor

The goal of this plan is to rebuild the application's foundation without altering the user-facing experience.

*   **Preserve UI/UX:** The appearance, layout, components, and interactive features of the portal will not be changed. The refactoring will happen at the data and logic layer.
*   **True Separation of Demo vs. Live:**
    *   **Demo Mode:** Will continue to use the existing `mockData.ts` to provide a rich, interactive experience for evaluation.
    *   **Live Mode:** Will be rebuilt to connect to a new, secure backend with a real database. The `isDemoMode` flag will become the switch that determines whether the frontend fetches data from the mock files or the live API. Do this step only if you are absolutely sure that it look and work exactly same as demo mode except that instead of demo examples the website will load the real data procided by various users who are approved to be on the platform. 
*   **Incremental, Foundational Changes:** We will follow a structured series of PRs, starting with the most critical foundational pieces (backend, database, authentication) before moving on to individual features.

## 3. Proposed Refactoring Plan (Series of PRs)

This plan outlines the sequence of pull requests required to transform the prototype into a robust application.

---

### **PR-L1: Development Environment & CI Setup**
*   **Aligns With:** Original `PR #3`
*   **Tasks:**
    1.  Install and configure ESLint, Prettier, and Husky to enforce code quality and a consistent style.
    2.  Create a basic GitHub Actions workflow to automatically run linting and tests on every commit.
*   **Rationale:** Establishes a professional and reliable development process, ensuring all future code adheres to a high standard. This is a foundational step for any serious project.

---

### **PR-L2: Backend & Database Scaffolding**
*   **Aligns With:** New Requirement
*   **Tasks:**
    1.  Initialize a new Node.js/Express.js application in a `/server` directory.
    2.  Set up a connection to a real database (e.g., PostgreSQL).
    3.  Define the initial database schema (using an ORM like Prisma or Sequelize) for `Users`, including fields for `id`, `email`, `passwordHash`, `name`, `role`, etc.
*   **Rationale:** Creates the server-side foundation for "Live Mode." This is the first and most critical step in moving away from the `localStorage`-based architecture without changing the present functionalities and appearance. 

---

### **PR-L3: Secure Authentication API**
*   **Aligns With:** New Requirement
*   **Tasks:**
    1.  Build secure API endpoints on the Express.js server for user registration (`/api/auth/register`) and login (`/api/auth/login`).
    2.  Implement password hashing with `bcrypt` during registration and comparison during login.
    3.  Generate JSON Web Tokens (JWTs) upon successful login to manage user sessions.
    4.  **Crucially, remove the hardcoded `SUPER_ADMIN` credentials from `contexts/DataContext.tsx`.**
*   **Rationale:** Replaces the current fake, insecure authentication system with a standard, secure, server-enforced authentication model.

---

### **PR-L4: Frontend Routing & State Management Setup**
*   **Aligns With:** New Requirement
*   **Tasks:**
    1.  Install `react-router-dom` and refactor the `App.tsx` `switch` statement into a proper routing structure (`<BrowserRouter>`, `<Routes>`, `<Route>`).
    2.  Create separate page components (e.g., `DashboardPage.tsx`, `MarketplacePage.tsx`).
    3.  Install `Redux Toolkit` and create a global state store.
    4.  Create an `authSlice` in Redux to manage the user's authentication status, token, and profile information globally.
*   **Rationale:** Dismantles the "God Component" and introduces a scalable architecture for both navigation and state, drastically simplifying the codebase.

---

### **PR-L5: Connecting Frontend Auth to the API**
*   **Aligns With:** New Requirement
*   **Tasks:**
    1.  Use the present forms but Modify the frontend login/registration to make API calls to the new backend endpoints (`/api/auth/login`).
    2.  Upon successful login, store the JWT in the Redux `authSlice` and in `localStorage` for session persistence.
    3.  Create an API client utility (e.g., using Axios) that automatically attaches the JWT to the headers of all subsequent requests, allowing the backend to identify the user.
*   **Rationale:** This PR wires the frontend to the backend, making the "Live Mode" login real for the first time. The `isDemoMode` flag will now correctly bypass this and use mock data.

---

### **PR-L6+: Per-Feature Backend Migration**
*   **Aligns With:** Original `PR #9+`
*   **Tasks:** This will be a series of PRs, one for each major feature. For each feature (e.g., Marketplace, Governance, Roster):
    1.  **Backend:** Define the database schema and create secure API endpoints for all necessary CRUD (Create, Read, Update, Delete) operations.
    2.  **Frontend:** Refactor the relevant component (e.g., `Marketplace.tsx`) to fetch its data. If `isDemoMode` is true, it will use `MOCK_DATA`. If `isDemoMode` is false, it will call the new API endpoints.
*   **Rationale:** This is the methodical process of migrating each feature from the fake `localStorage` system to the real, centralized database, completing the transition to a functional and scalable application.

