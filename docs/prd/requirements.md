# Requirements

## Functional Requirements
1.  **FR1:** An administrator must be able to create manager profiles and generate a unique QR code for each one.
2.  **FR2:** Scanning a manager-specific QR code must direct the user to a web-based time-off request form.
3.  **FR3:** The form must collect the employee's name, a request start date, a request end date, and an optional reason.
4.  **FR4:** When the form is submitted, the data must be saved and correctly associated with the manager to whom the QR code belongs.
5.  **FR5:** Managers must be able to securely log in to a private portal to view a list of requests submitted *only* to them.
6.  **FR6:** The manager's portal must display the employee's name, requested dates, reason, and submission time for each request.

## Non-Functional Requirements
1.  **NFR1:** The request form must be mobile-responsive and load in under 3 seconds on a standard mobile network.
2.  **NFR2:** The MVP application must be built using a self-hosted **n8n** workflow.
3.  **NFR3:** All employee data must be securely transmitted and stored.
4.  **NFR4:** The manager's portal must be protected by a secure authentication mechanism.
5.  **NFR5:** The post-MVP custom application must be containerized with **Docker** to ensure portability.

---
