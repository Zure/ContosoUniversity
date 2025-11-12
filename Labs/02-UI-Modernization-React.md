# Lab 2: UI Modernization - Moving to React

## Overview

In this lab, you'll use Spec-Kit with GitHub Copilot to plan and execute a significant architectural change: migrating the Contoso University UI from Razor Pages to a modern React single-page application with a REST API backend. This lab focuses on the **spec-kit process** rather than specific code examples.

## Learning Objectives

- Apply Spec-Kit methodology for large-scale architectural changes
- Use `/speckit` commands to drive development workflow
- Practice spec-driven development for complex features
- Understand how AI assists in implementation from specifications
- Learn to validate and test architectural changes systematically

## Prerequisites

- Completed Lab 1 (Spec-Kit basics and .NET upgrade)
- Node.js 18+ and npm installed
- Basic React and TypeScript knowledge helpful
- GitHub Copilot enabled in your IDE
- VS Code with MCP support (recommended)

## Duration

Approximately 1-1,5 hours

---

## Setup: Installing MCP Servers

Before starting the main lab, set up two MCP servers that will help you access up-to-date documentation and library information.

### What are MCP Servers?

Model Context Protocol (MCP) servers provide AI assistants with real-time access to external data sources and tools. For this lab, we'll use:

1. **Microsoft Docs MCP Server**: Access to Microsoft Learn documentation for .NET, ASP.NET Core, etc.
2. **Context7 MCP Server**: Access to library documentation for React, shadcn/ui, Tailwind CSS, etc.

### Installing Microsoft Docs MCP Server

#### For VS Code

1. Install the MCP extension for VS Code (if not already installed):

   - Open VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Extensions: Install Extensions"
   - Search for "Model Context Protocol" and install

2. Add the Microsoft Docs MCP server to your VS Code settings:
   - Open VS Code settings JSON: `Cmd+Shift+P` → "Preferences: Open User Settings (JSON)"
   - Add to the `mcpServers` configuration:

```json
{
  "mcp": {
    "servers": {
      "microsoft-docs": {
        "command": "npx",
        "args": ["-y", "@microsoft/docs-mcp-server"]
      }
    }
  }
}
```

### Installing Context7 MCP Server

1. Add Context7 to your MCP configuration in VS Code settings JSON:

```json
{
  "mcp": {
    "servers": {
      "microsoft-docs": {
        "command": "npx",
        "args": ["-y", "@microsoft/docs-mcp-server"]
      },
      "context7": {
        "command": "npx",
        "args": ["-y", "@context7/mcp-server"]
      }
    }
  }
}
```

### Verify Installation

1. Restart VS Code
2. You should see the MCP servers appear in the tools menu or sidebar
3. Test by asking: "What MCP servers are available?"

You should see both `microsoft-docs` and `context7` listed.

---

## Part 1: Create the Specification

### Step 1: Start with Spec-Kit

**Important**: Before creating your specification, leverage the MCP servers you installed to get the latest information:

```bash
# Get latest ASP.NET Core API documentation from Microsoft Docs MCP
Use the microsoft-docs MCP server to retrieve current best practices for ASP.NET Core Web API development, including REST conventions, CORS configuration, and Swagger/OpenAPI setup.

# Get latest React and TypeScript patterns from Context7
Use the context7 MCP server to retrieve documentation for React (latest version), TypeScript integration patterns, and recommended project structure for SPA applications.
```

Now use the `/speckit.specify` command to create your specification:

````bash
/speckit.specify Migrate the Contoso University UI from Razor Pages to a React SPA with a REST API backend. Focus on separating frontend and backend concerns, maintaining all existing CRUD functionality, and enabling future mobile app development.

Use the Microsoft Docs MCP server to reference current ASP.NET Core Web API best practices.
Use the Context7 MCP server to reference current React and TypeScript patterns.

```markdown
````

This creates a new branch and generates the specification file with the initial problem statement and scope.

### Step 2: Review and Refine the Spec

Open `specs/002-**/spec.md` and review what Spec-Kit generated. The spec should define:

- **Problem Statement**: Why this change is needed
- **Scope**: What's in and out of scope
- **Architecture**: High-level technical approach
- **Success Criteria**: How you'll know it's done

You can refine the spec if needed, or ask Copilot to enhance it:

```bash
/speckit.clarify What specific API endpoints do we need? What about authentication and authorization?
```

### Step 3: Update the Constitution

Update your project constitution to include guidance about API design:

```bash
/speckit.constitution Update the constitution to include REST API design principles, React best practices, and guidelines for frontend-backend separation.
```

---

## Part 2: Plan the Implementation

### Step 1: Create the Technical Plan

Use Spec-Kit to generate a detailed implementation plan:

```bash
/speckit.plan Create a comprehensive plan for implementing the React UI migration, including backend API development, frontend React app setup, data transfer objects, routing strategy, and testing approach.
```

Review the generated `specs/002-**/plan.md`. It should break down the work into phases:

- Phase 1: Backend API endpoints
- Phase 2: React application setup
- Phase 3: Component implementation
- Phase 4: Integration and testing

### Step 2: Research Best Practices

Use both MCP servers to gather comprehensive information:

```bash
# Get Microsoft's latest guidance on ASP.NET Core APIs
/speckit.clarify Use the microsoft-docs MCP server to research:
- Latest ASP.NET Core REST API best practices
- DTO patterns and AutoMapper configuration
- CORS setup for SPA applications
- Swagger/OpenAPI documentation standards
- API versioning strategies
- Error handling and validation patterns

# Get React ecosystem best practices
/speckit.clarify Use the context7 MCP server to research:
- Current React TypeScript project setup
- React Query (TanStack Query) for data fetching
- React Router v6 patterns
- Component composition patterns
- State management recommendations
- Form handling with React Hook Form
```

Spec-Kit will gather this information and potentially generate `specs/002-**/research.md` with findings from both MCP servers.

---

## Part 3: Generate Implementation Tasks

### Step 1: Break Down the Work

Use Spec-Kit to create actionable tasks:

```bash
/speckit.tasks
```

This generates `specs/002-**/tasks.md` with a checklist of specific implementation steps.

### Step 2: Cross-Check with Analysis

Run an analysis to ensure consistency:

```bash
/speckit.analyze
```

This validates that your spec, plan, and tasks are aligned and complete.

---

## Part 4: Implement with Copilot

### Step 1: Start Implementation

Use the implement command to begin:

```bash
/speckit.implement
```

Copilot will work through your tasks systematically, creating:

- REST API controllers for all entities
- DTOs and mapping configurations
- CORS and Swagger setup
- React application structure
- Components for each entity
- API service layers
- Routing configuration

### Step 2: Guide the Implementation

As Copilot implements, you can provide guidance:

```
Focus on the Students entity first as a complete example, then apply the same patterns to Courses, Instructors, and Departments.
```

Or:

```
For the React components, use functional components with hooks, and implement proper loading and error states for all API calls.
```

### Step 3: Validate as You Go

After each major component is implemented, test it:

**For Backend API**:

```bash
cd ContosoUniversity
dotnet run
# Navigate to https://localhost:7054/swagger
# Test each endpoint
```

**For Frontend**:

```bash
cd contoso-university-ui
npm start
# Test the UI in browser at http://localhost:3000
```

---

## Part 5: Add Tailwind CSS and shadcn/ui

### Step 1: Specify the Design System Setup

Now that your React app is functional, add a modern design system using the latest library information:

```bash
# First, get the latest shadcn/ui and Tailwind CSS information
Use the context7 MCP server to retrieve:
- Latest shadcn/ui installation and configuration guide
- Tailwind CSS v3+ setup for React applications
- shadcn/ui component catalog and usage patterns
- Best practices for theming and customization

# Then create your specification
/speckit.specify Set up Tailwind CSS and shadcn/ui in the React application. Configure a professional design system with cohesive color palette, typography scale, and reusable component patterns. Install essential shadcn/ui components (Button, Input, Card, Table, Select, Form) and create a base layout with navigation. Use the latest installation methods and configuration patterns from the context7 MCP server.
```

### Step 2: Plan and Implement

```bash
# Get comprehensive setup guidance
Use the context7 MCP server to get detailed information about:
- shadcn/ui CLI installation and initialization
- Tailwind configuration for shadcn/ui
- Component installation commands
- Theme customization best practices

# Create your plan
/speckit.plan Create a setup plan for Tailwind CSS and shadcn/ui including:
- Installation steps using the latest CLI tools
- Configuration for Vite/Create React App
- Theme customization with design tokens
- Component installation (Button, Input, Card, Table, Select, Form, Dialog)
- Update the Students page as a reference implementation

Use guidance from the context7 MCP server for all setup steps.

/speckit.tasks
/speckit.implement
```

Copilot will:

- Install and configure Tailwind CSS with the latest version
- Initialize shadcn/ui using the official CLI
- Set up design tokens (colors, fonts, spacing) following shadcn/ui conventions
- Install base components using the shadcn CLI
- Update the Students page to use the new components
- Ensure TypeScript types are properly configured

### Step 3: Verify Design System

Test the updated Students page:

- [ ] Tailwind classes apply correctly
- [ ] shadcn/ui components render properly
- [ ] Color scheme looks professional
- [ ] Responsive layout works on mobile
- [ ] Components are accessible (keyboard navigation works)

---

## Part 6: Testing and Validation

### Step 1: Test Against Success Criteria

Review your spec's success criteria and verify each one:

- [ ] All CRUD operations accessible via REST API
- [ ] React app successfully calls all API endpoints
- [ ] Pagination works in React UI
- [ ] Related data loading works (e.g., courses with departments)
- [ ] Error handling displays properly
- [ ] Application maintainable and testable

### Step 2: Integration Testing

Run both applications simultaneously and test the complete workflow:

**Terminal 1** (Backend):

```bash
cd ContosoUniversity
dotnet run
```

**Terminal 2** (Frontend):

```bash
cd contoso-university-ui
npm start
```

Test all entities (Students, Courses, Instructors, Departments):

1. List view with pagination
2. Create new record
3. View details
4. Edit record
5. Delete record
6. Navigate between related entities

### Step 3: Update Documentation

Ask Copilot to update any documentation:

```
Update the main README.md to include instructions for running both the API and React frontend, including environment setup and configuration.
```

---

## Part 7: Commit and Create Pull Request

### Step 1: Review Changes

```bash
git status
git diff
```

### Step 2: Commit with Spec Reference

The implement step should have committed changes, but if not:

```bash
git add .
git commit -m "Implement React UI with REST API backend

- Created REST API controllers for Students, Courses, Instructors, Departments
- Implemented DTOs and AutoMapper configuration
- Configured Swagger for API documentation
- Added CORS support for React frontend
- Built React SPA with TypeScript
- Implemented all CRUD operations in React
- Added React Query for efficient data fetching
- Configured routing with React Router

Follows spec: specs/002-**/spec.md"
```

### Step 3: Create Pull Request

```bash
git push origin 002-**
```

Or merge locally if preferred:

```
Merge the current branch into main branch.
```

---

## Key Takeaways

1. **Spec-First Approach**: Starting with `/speckit.specify` ensures clarity before implementation
2. **Iterative Process**: The spec-kit commands (specify → plan → tasks → implement) create a systematic workflow
3. **AI-Assisted Implementation**: Copilot implements from specs, not ad-hoc requests
4. **Validation at Each Step**: Test and validate against success criteria throughout
5. **Documentation as Code**: Specs serve as living documentation of architectural decisions
6. **MCP Servers for Current Information**: Leverage microsoft-docs and context7 MCP servers to access the latest library documentation and best practices, ensuring your implementation uses current patterns and versions

## What You Learned About Spec-Kit

- **`/speckit.specify`**: Initializes a feature with specification
- **`/speckit.plan`**: Creates detailed technical implementation plan
- **`/speckit.clarify`**: Requests additional research or detail
- **`/speckit.tasks`**: Breaks down plan into actionable checklist
- **`/speckit.analyze`**: Validates consistency across artifacts
- **`/speckit.implement`**: Executes the implementation guided by specs
- **`/speckit.constitution`**: Updates project guidelines and principles

## Challenge Extensions

Once your basic React UI is working, create new specs for:

1. **Authentication**: Add JWT authentication to API and React app
2. **State Management**: Implement global state with Zustand or Redux
3. **Testing**: Add comprehensive test coverage (Jest, React Testing Library, Playwright)
4. **Performance**: Implement code splitting, lazy loading, and optimization
5. **Accessibility**: Audit and improve WCAG compliance

For each extension, follow the same spec-kit process!

## Troubleshooting

When you encounter issues, leverage your MCP servers for the most current solutions:

### API Issues

```
I'm getting a CORS error when the React app calls the API.

Use the microsoft-docs MCP server to:
1. Get the latest ASP.NET Core CORS configuration guidance
2. Review current best practices for SPA CORS setup
3. Check for any recent security updates

Then review the spec at specs/002-**/spec.md and help me update the CORS configuration in Program.cs with the latest approach.
```

### React/UI Issues

```
The pagination isn't working correctly in the Students list.

Use the context7 MCP server to:
1. Get current React state management patterns for pagination
2. Review React Query pagination documentation
3. Find examples of table pagination with React

Help me debug the API endpoint and React component based on current best practices.
```

### shadcn/ui Issues

```
I'm having trouble with the shadcn/ui Form component validation.

Use the context7 MCP server to:
1. Get the latest shadcn/ui Form component documentation
2. Review React Hook Form integration patterns
3. Find validation examples with Zod

Update my Students form component following the current recommended patterns.
```

### Getting Latest Library Versions

```
What versions of React, Tailwind, and shadcn/ui should I be using?

Use the context7 MCP server to:
1. Check the latest stable versions of React
2. Get current Tailwind CSS version recommendations
3. Review shadcn/ui compatibility requirements

Provide installation commands with the correct versions.
```

## Next Steps

Proceed to **Lab 3: Git Worktrees** to learn how to work on multiple feature variations in parallel using git worktrees.

## Resources

- [Spec-Kit Quickstart Guide](https://github.github.io/spec-kit/quickstart.html)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Microsoft Docs MCP Server](https://github.com/microsoft/docs-mcp-server)
- [Context7 MCP Server](https://context7.com/)
- [React Documentation](https://react.dev/)
- [React Query](https://tanstack.com/query/latest)
- [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core/web-api)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
