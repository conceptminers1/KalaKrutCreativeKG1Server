# Project "KalaKrut Creative" - Deployment and Architecture Strategy

## 1. Executive Summary

This document outlines the strategic roadmap for successfully deploying the KalaKrut Creative platform and evolving its backend architecture to support future growth, including advanced features like graph-based analytics and Web3 transaction integration.

The immediate and critical priority is to **migrate the backend from a development-only SQLite database to a production-grade, persistent database**. The current architecture is not viable for a live environment and will result in total data loss upon server restarts.

## 2. Initial State Analysis & Core Problem

### Objective
The primary goal is to deploy the full-stack application (React frontend, Express backend) to a production environment on Firebase and Google Cloud Run, allowing users to register and interact with the platform reliably.

### Problem Statement
Our investigation of the codebase revealed a critical architectural flaw:

*   **Ephemeral Database:** The Express backend is currently configured to use `sqlite3` to interact with a local database file (`dev.db`).
*   **Stateless Production Environment:** The target deployment environment, Cloud Run, is stateless. Its instances have ephemeral filesystems, meaning any local file—including the `dev.db` database—is permanently deleted whenever the server instance restarts.
*   **Consequence:** Any user data created (registrations, profiles, etc.) will be lost, making the application non-functional in a production setting. We confirmed via `curl` tests that while the APIs function locally, they are entirely dependent on this temporary database file.

Although a `prisma/schema.prisma` file exists, the server code is **not currently using it**, relying instead on direct `sqlite3` library calls.

## 3. Immediate Strategic Priority: Backend Refactoring

To prepare the application for a successful production deployment, we must refactor the backend. This is the foundational step upon which all other features will be built.

**Action Plan:**

1.  **Stop Using `sqlite3`:** The first step is to completely remove all code related to the `sqlite3` library from `server/src/index.js`.
2.  **Integrate Prisma Client:** Modify the server to initialize and use the Prisma Client for all database operations (queries, creates, updates, deletes). This aligns the server's logic with the defined `prisma/schema.prisma`.
3.  **Provision a Production Database:** Set up a cloud-hosted, persistent SQL database. **Google Cloud SQL (PostgreSQL or MySQL)** is the recommended choice as it integrates seamlessly with Cloud Run.
4.  **Update Prisma Configuration:** Update the `datasource` block in `server/prisma/schema.prisma` to connect to the new production database using its connection string.
5.  **Deploy:** Once the backend is using Prisma and connected to the production database, the application can be safely and reliably deployed.

## 4. Future Architecture & Feature Expansion

Once the core application is stabilized, we can implement the advanced features discussed. The recommended approach is **Polyglot Persistence**, using the best database technology for each specific task.

### A. System of Record: MySQL/PostgreSQL
*   **Role:** The primary transactional database for the application. It will store all core, structured data such as users, artist profiles, proposals, and marketplace items.
*   **Implementation:** This is the database that Prisma will connect to as outlined in the immediate action plan above.

### B. Graph Analytics & Features: Neo4j
*   **Role:** A secondary, specialized database for analyzing complex relationships and powering user-facing features.
*   **Use Cases:**
    *   **Internal BI:** Discovering non-obvious connections between artists, investors, and opportunities.
    *   **Portal Features:** Building recommendation engines ("You might also know..."), visualizing community networks, and providing advanced user insights.
*   **Implementation:** Data will be synchronized from the primary SQL database into Neo4j via an ETL (Extract, Transform, Load) pipeline. The application will query Neo4j directly for graph-specific features.

### C. Web3 Transaction Handling
*   **Challenge:** It is inefficient to query the blockchain directly for application data like transaction histories.
*   **Solution: The Indexer Pattern**
    1.  **Blockchain as Source of Truth:** The blockchain remains the ultimate, immutable ledger.
    2.  **Indexer Service:** A dedicated microservice will listen for relevant events from your smart contracts.
    3.  **Sync to SQL Database:** When the indexer detects a transaction, it will process it and save a structured copy into a dedicated table (e.g., `web3_transactions`) in the primary MySQL/PostgreSQL database.
*   **Data Flow:** The complete data flow will be: `Blockchain -> Indexer Service -> Primary SQL Database -> Neo4j Graph`. This creates a high-performance, scalable system for your dApp.

## 5. Conclusion

The path to a successful deployment and a feature-rich platform is clear. The immediate, non-negotiable next step is to execute the backend refactoring. After that foundation is laid, we can proceed with the exciting work of integrating the graph and Web3 components.
