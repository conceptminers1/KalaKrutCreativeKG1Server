# Project Overhaul Plan

This document outlines the plan for overhauling the project to improve its logic, security, integrity, and make it PWA-ready. The following PRs will be implemented in order.

## PR Breakdown

*   **PR #1: docs/OVERHAUL_PLAN.md + initial task list (Draft PR)**
    *   This document and the initial task list.
*   **PR #2: feature/demo-mode — add REACT_APP_DEMO_MODE, demo banner, seed scripts (enable demos, stub payments)**
    *   Add a `REACT_APP_DEMO_MODE` environment variable.
    *   Display a demo banner when in demo mode.
    *   Create seed scripts to populate the database with existing demo data with possibility to add more mock examples. Do not change any of the present and main ui elements, appearance od the website, features, functionalities, components, etc. 
    * Do not change or remove any modals, their links with any present profiles, pages, features or buttons. 
*   **PR #3: testing/ci — add ESLint, Prettier, husky, basic GitHub Actions (lint + test)**
    *   Set up ESLint for static code analysis.
    *   Set up Prettier for code formatting.
    *   Use husky to run pre-commit hooks.
    *   Create a basic GitHub Actions workflow to run linting and tests on push and pull requests.
*   **PR #4: testing/playwright — add Playwright + initial booking E2E test**
    *   Integrate Playwright for end-to-end testing.
    *   Write an initial E2E test for the booking flow.
*   **PR #5: pwa/manifest-sw — add manifest.json, basic service worker, registration (register only in prod)**
    *   Create a `manifest.json` file for PWA metadata.
    *   Implement a basic service worker for offline capabilities.
    *   Register the service worker in production builds only.
*   **PR #6: monitoring/sentry — add Sentry integration scaffold (disabled by default)**
    *   Integrate the Sentry SDK for error monitoring.
    *   Keep Sentry disabled by default and enable it via an environment variable.
*   **PR #7: accessibility/storybook — add Storybook and key component stories; integrate axe checks**
    *   Set up Storybook to develop and showcase components in isolation.
    *   Write short stories for key components.
    *   Integrate `axe-core` with Storybook for accessibility checks.
*   **PR #8: data/purge-modal — implement secure Super Admin purge flow (moved to end)**
    *  Using present settings, create a secure Super Admin flow to purge data. If it already exists do not disturb it. 
    *   This will be used to reset the demo data after a certain period.
*   **PR #9+: per-journey stabilization PRs — small, focused PRs for each core journey (one per journey)**
    *   Break down the stabilization of each core user journey into smaller, focused PRs.
*   **PR #10+: performance & lazy-loading improvements and Lighthouse fixes**
    *   Analyze and improve the performance of the application.
    *   Implement lazy loading for components and routes.
    *   Address any issues reported by Lighthouse audits.
