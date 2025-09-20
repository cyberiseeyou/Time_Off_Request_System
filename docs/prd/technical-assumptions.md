# Technical Assumptions

## Repository Structure: Monorepo
A **monorepo** is recommended to simplify development and dependency management.

## Service Architecture
* **For the MVP:** A **workflow-based architecture** will be implemented using a self-hosted **n8n** instance.
* **For the Post-MVP custom app:** The architecture will be a **containerized, serverless-friendly** web application.

## Testing Requirements: Unit + Integration
The project will require both **unit tests** for individual functions and **integration tests** to ensure different parts of the system work together.

## Additional Technical Assumptions
* **Backend Technology:** Python (FastAPI).
* **Frontend Technology:** Simple HTML, CSS, and JavaScript.
* **Database:** SQLite for the MVP, with a migration path to MySQL.
* **Deployment:** The application must be Dockerized.

---
