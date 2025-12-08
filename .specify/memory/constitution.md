
# Contoso University Constitution


## Core Principles

### I. Spec-First Development
All features and changes MUST begin with a written specification. Specifications define requirements, user stories, and acceptance criteria before implementation starts. No code is written until the spec is approved.

### II. Test-Driven Implementation
Tests MUST be written before implementation. Red-Green-Refactor cycle is enforced. All features require independently testable user stories and automated tests. No feature is complete without passing tests.

### III. AI-Assisted Workflows
AI tools (e.g., GitHub Copilot) MUST be used for code generation, planning, and validation where possible. All AI-generated code and plans MUST be reviewed and approved by a human before merging.

### IV. Documentation as Deliverable
Every feature, plan, and change MUST be documented. Specs, plans, and tasks serve as living documentation. Documentation MUST be updated with every change and reviewed for accuracy.

### V. Simplicity and Validation
Solutions MUST be as simple as possible. All changes MUST be validated against explicit success criteria. Complexity requires justification in the spec. Validation steps MUST be documented and repeatable.


## Additional Constraints

- Technology stack: .NET 9.0+, ASP.NET Core, Razor Pages
- All dependencies MUST be open source or approved by project maintainers
- Code style MUST follow .NET and C# best practices
- Security and compliance standards MUST be followed for all code and data


## Development Workflow

- All work MUST follow the Spec-Kit workflow: spec → plan → tasks → implement → validate
- Code reviews are REQUIRED for all pull requests
- Automated tests MUST pass before merging
- Documentation MUST be updated with every change
- Deployment requires approval from at least one maintainer


## Governance

- This constitution supersedes all previous project practices
- Amendments require documentation, review, and approval by maintainers
- All PRs and reviews MUST verify compliance with these principles
- Constitution version MUST be incremented for any substantive change
- Compliance reviews are conducted quarterly or after major changes

**Version**: 1.0.0 | **Ratified**: 2025-12-08 | **Last Amended**: 2025-12-08

