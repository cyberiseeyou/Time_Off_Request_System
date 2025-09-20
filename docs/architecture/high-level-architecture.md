# High-Level Architecture

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
