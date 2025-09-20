# Full-Stack Architecture: QR Code Time-Off System

## Introduction

This document outlines the complete full-stack architecture for the Time-Off Request System. The project will be built upon an existing Next.js frontend application, and this architecture defines the backend services and API required to power it.

---

## High-Level Architecture

The system is a modern full-stack application with a **Next.js frontend** and a **Python (FastAPI) backend API**. Communication is handled via a **REST API**. The entire application will be containerized with **Docker** for portability. The repository will be a **Monorepo** to simplify management.

graph TD
    subgraph "User's Device"
        A[Browser]
    end

    subgraph "Hosting (Vultr/Local Server)"
        B[Next.js Frontend]
        C[Python FastAPI Backend]
        D[(MySQL Database)]
    end

    A -- "HTTPS" --> B
    B -- "API Calls (REST)" --> C
    C -- "CRUD Operations" --> D
---

## Tech Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Frontend Language | TypeScript | `^5` | Type-safe frontend code |
| Frontend Framework | Next.js | `14.2.16` | Core UI framework |
| UI Components | shadcn/ui | (various) | Core UI components |
| Styling | Tailwind CSS | `^4.1.9`| CSS framework |
| Backend Language | Python | `~3.11` | Backend API language |
| Backend Framework | FastAPI | (latest) | Web framework for API |
| Database | SQLite / MySQL| `8.x` | Data storage |
| Deployment | Docker | (latest) | Containerization |

---

## Data Models & Database Schema

* **`managers` Table:** Stores `id`, `name`, `email`, and a secure `password_hash`.
* **`time_off_requests` Table:** Stores `id`, `employee_name`, `start_date`, `end_date`, `reason`, and a `manager_id` foreign key.
* Shared data structures will be defined in **TypeScript interfaces** in `packages/shared-types` for use by both the frontend and backend.

---

## API Specification (OpenAPI 3.0)

* `POST /requests`: Public endpoint to submit a new time-off request.
* `POST /manager/login`: Secure endpoint for managers to authenticate.
* `GET /manager/requests`: Secure, cookie-protected endpoint for an authenticated manager to retrieve their list of requests.

---

## Unified Project Structure

A monorepo will be used with the following structure:
* `apps/web/`: The existing Next.js frontend.
* `apps/api/`: The new Python FastAPI backend.
* `packages/shared-types/`: For shared TypeScript data models.
* `docker-compose.yml`: To run the entire application stack.

---

## Deployment & Development

* **Development:** The entire stack can be run locally using a single `docker-compose up` command.
* **Deployment:** The application is designed to be deployed as a set of Docker containers on any host, such as Vultr. A CI/CD pipeline (e.g., GitHub Actions) can be configured to automate builds and deployments.
* **Testing:** The strategy is based on the Testing Pyramid, with a foundation of unit tests (React Testing Library for frontend, pytest for backend) and a small number of end-to-end tests (Cypress/Playwright).

