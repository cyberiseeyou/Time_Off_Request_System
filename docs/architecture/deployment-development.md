# Deployment & Development

* **Development:** The entire stack can be run locally using a single `docker-compose up` command.
* **Deployment:** The application is designed to be deployed as a set of Docker containers on any host, such as Vultr. A CI/CD pipeline (e.g., GitHub Actions) can be configured to automate builds and deployments.
* **Testing:** The strategy is based on the Testing Pyramid, with a foundation of unit tests (React Testing Library for frontend, pytest for backend) and a small number of end-to-end tests (Cypress/Playwright).

