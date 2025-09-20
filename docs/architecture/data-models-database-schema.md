# Data Models & Database Schema

* **`managers` Table:** Stores `id`, `name`, `email`, and a secure `password_hash`.
* **`time_off_requests` Table:** Stores `id`, `employee_name`, `start_date`, `end_date`, `reason`, and a `manager_id` foreign key.
* Shared data structures will be defined in **TypeScript interfaces** in `packages/shared-types` for use by both the frontend and backend.

---
