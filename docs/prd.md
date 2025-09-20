# Product Requirements Document (PRD): QR Code Time-Off System

## Goals and Background Context

### Goals
* **Standardize the Process:** Achieve 95% adoption of the new system for all time-off requests across the company within 3 months of launch.
* **Increase Operational Efficiency:** Reduce the administrative time managers spend collecting and tracking time-off requests by at least 50%.
* **Eliminate Routing Errors:** Reduce the rate of misdirected or lost time-off requests to zero.

### Background Context
The company currently lacks a standardized method for handling employee time-off requests, relying on a mix of inconsistent channels like email, text, and paper forms. This creates inefficiency for managers, a frustrating experience for employees, and introduces a high risk of errors such as lost or misrouted requests. This PRD outlines the requirements for a centralized, QR-code-based system designed to solve these problems by creating a single, simple, and reliable workflow.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-09-19 | 1.0 | Initial PRD draft created from Project Brief | John (PM) |

---

## Requirements

### Functional Requirements
1.  **FR1:** An administrator must be able to create manager profiles and generate a unique QR code for each one.
2.  **FR2:** Scanning a manager-specific QR code must direct the user to a web-based time-off request form.
3.  **FR3:** The form must collect the employee's name, a request start date, a request end date, and an optional reason.
4.  **FR4:** When the form is submitted, the data must be saved and correctly associated with the manager to whom the QR code belongs.
5.  **FR5:** Managers must be able to securely log in to a private portal to view a list of requests submitted *only* to them.
6.  **FR6:** The manager's portal must display the employee's name, requested dates, reason, and submission time for each request.

### Non-Functional Requirements
1.  **NFR1:** The request form must be mobile-responsive and load in under 3 seconds on a standard mobile network.
2.  **NFR2:** The MVP application must be built using a self-hosted **n8n** workflow.
3.  **NFR3:** All employee data must be securely transmitted and stored.
4.  **NFR4:** The manager's portal must be protected by a secure authentication mechanism.
5.  **NFR5:** The post-MVP custom application must be containerized with **Docker** to ensure portability.

---

## User Interface Design Goals

### Overall UX Vision
The vision is a frictionless, "scan-and-submit" experience for employees and a clear, uncluttered dashboard for managers. The design will prioritize speed and clarity above all else, requiring minimal user thought to complete core tasks.

### Core Screens and Views
1.  **Time-Off Request Form (Public):** The single page an employee sees after scanning the QR code.
2.  **Manager Request Dashboard (Private):** The secure page where a manager logs in to view their list of submitted requests.

### Branding
* **Primary Logo:** The **Product Connections** logo will be the primary brand identifier.
* **Affiliated Logo:** The **Crossmark** logo should be included in a subordinate role, such as in the footer with the text "A Crossmark Agency."
* **Color Palette:** The core color scheme will be based on the Product Connections logo, featuring its distinctive dark and light blues.

---

## Technical Assumptions

### Repository Structure: Monorepo
A **monorepo** is recommended to simplify development and dependency management.

### Service Architecture
* **For the MVP:** A **workflow-based architecture** will be implemented using a self-hosted **n8n** instance.
* **For the Post-MVP custom app:** The architecture will be a **containerized, serverless-friendly** web application.

### Testing Requirements: Unit + Integration
The project will require both **unit tests** for individual functions and **integration tests** to ensure different parts of the system work together.

### Additional Technical Assumptions
* **Backend Technology:** Python (FastAPI).
* **Frontend Technology:** Simple HTML, CSS, and JavaScript.
* **Database:** SQLite for the MVP, with a migration path to MySQL.
* **Deployment:** The application must be Dockerized.

---

## Epic and Story Structure

### Epic 1: MVP Launch & Core Workflow Validation
**Goal:** To rapidly launch the core time-off request system using n8n to provide immediate value and validate the QR-code-to-form workflow.

* **Story 1.1: Initial Setup and Data Storage:** Set up the n8n workflow and create the necessary database tables (`managers`, `requests`).
* **Story 1.2: Employee Request Form & Submission:** Create the public-facing web form that employees will use to submit requests.
* **Story 1.3: Manager Request Viewing Portal:** Build the secure web page where managers can view their submitted requests.
* **Story 1.4: Admin Process for Manager & QR Code Generation:** Establish the process for adding new managers and creating their unique QR codes.

### Epic 2: Custom Application Foundation & Management
**Goal:** To build the custom Python application, which will replace the n8n MVP and introduce in-app request management (approve/deny) and automated notifications.

* **Story 2.1: Custom Application Scaffolding:** Set up the basic structure of the Python FastAPI application and containerize it with Docker.
* **Story 2.2: Rebuild Employee Request Submission:** Re-implement the employee-facing form and submission logic in the new custom application.
* **Story 2.3: Rebuild Manager Portal with Secure Authentication:** Create a secure login system and dashboard for managers in the Python app.
* **Story 2.4: Implement In-App Request Management:** Add "Approve" and "Deny" functionality for managers.
* **Story 2.5: Implement Automated Email Notifications:** Integrate an email service to notify managers of new requests and employees of status changes.

### Epic 3: Employee Portal & Advanced Availability Module
**Goal:** To expand the custom application with an employee-facing portal and the dynamic scheduling and availability features from our long-term vision.

* **Story 3.1: Employee Authentication & Request History:** Create a secure login portal for employees to view their request history.
* **Story 3.2: Manager Interface for Staffing Needs:** Allow managers to post open shifts or staffing needs.
* **Story 3.3: Employee Calendar View:** Provide a calendar for employees to see their time off and open shifts.
* **Story 3.4: Employee Availability Change Requests:** Enable employees to submit changes to their general work availability.
