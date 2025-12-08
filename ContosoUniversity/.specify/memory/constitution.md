# ContosoUniversity Project Constitution

## Core Principles

### I. Razor Pages Architecture
ContosoUniversity is built using ASP.NET Core Razor Pages (.NET 6). The project follows a page-centric architecture, separating concerns between UI, data access, and business logic.

### II. Test-First Development (NON-NEGOTIABLE)
All features and bug fixes must be developed using a test-driven approach. Unit and integration tests are required for all new code. Red-Green-Refactor cycle is strictly enforced.

### III. Integration Testing
Integration tests are mandatory for database interactions, service contracts, and shared schemas. Changes to contracts or inter-service communication require new or updated integration tests.

### IV. Observability & Logging
Structured logging is required throughout the application. All errors and significant events must be logged for debuggability and monitoring.

### V. Modernization & Simplicity
The project aims for easy migration to newer .NET versions and supports containerization. Simplicity is prioritized; avoid unnecessary complexity and follow YAGNI principles.

## Technology Stack & Constraints
- ASP.NET Core Razor Pages (.NET 6)
- Entity Framework Core for data access
- SQL Server (local or containerized)
- Dependency injection for all services
- Organized by feature: Students, Courses, Instructors, Departments
- All configuration in `appsettings.json`
- Static files in `wwwroot/`

## Development Workflow & Quality Gates
- All changes via pull requests
- Clear, descriptive commit messages
- Code review required for all PRs
- Run `dotnet build` and `dotnet test` before submitting
- Adhere to coding conventions and architectural guidelines
- Labs and exercises are located in the `Labs/` folder for workshop participants

## Governance
This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All PRs and reviews must verify compliance with these principles. Complexity must be justified. Use this constitution for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2024-06-13 | **Last Amended**: 2024-06-13
