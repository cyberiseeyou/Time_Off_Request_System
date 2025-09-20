# Epic and Story Structure

## Epic 1: MVP Launch & Core Workflow Validation
**Goal:** To rapidly launch the core time-off request system using n8n to provide immediate value and validate the QR-code-to-form workflow.

* **Story 1.1: Initial Setup and Data Storage:** Set up the n8n workflow and create the necessary database tables (`managers`, `requests`).
* **Story 1.2: Employee Request Form & Submission:** Create the public-facing web form that employees will use to submit requests.
* **Story 1.3: Manager Request Viewing Portal:** Build the secure web page where managers can view their submitted requests.
* **Story 1.4: Admin Process for Manager & QR Code Generation:** Establish the process for adding new managers and creating their unique QR codes.

## Epic 2: Custom Application Foundation & Management
**Goal:** To build the custom Python application, which will replace the n8n MVP and introduce in-app request management (approve/deny) and automated notifications.

* **Story 2.1: Custom Application Scaffolding:** Set up the basic structure of the Python FastAPI application and containerize it with Docker.
* **Story 2.2: Rebuild Employee Request Submission:** Re-implement the employee-facing form and submission logic in the new custom application.
* **Story 2.3: Rebuild Manager Portal with Secure Authentication:** Create a secure login system and dashboard for managers in the Python app.
* **Story 2.4: Implement In-App Request Management:** Add "Approve" and "Deny" functionality for managers.
* **Story 2.5: Implement Automated Email Notifications:** Integrate an email service to notify managers of new requests and employees of status changes.

## Epic 3: Employee Portal & Advanced Availability Module
**Goal:** To expand the custom application with an employee-facing portal and the dynamic scheduling and availability features from our long-term vision.

* **Story 3.1: Employee Authentication & Request History:** Create a secure login portal for employees to view their request history.
* **Story 3.2: Manager Interface for Staffing Needs:** Allow managers to post open shifts or staffing needs.
* **Story 3.3: Employee Calendar View:** Provide a calendar for employees to see their time off and open shifts.
* **Story 3.4: Employee Availability Change Requests:** Enable employees to submit changes to their general work availability.
