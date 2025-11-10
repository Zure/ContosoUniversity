# Lab 1: Introduction to Spec-Kit - Upgrading .NET Version

## Overview

In this lab, you'll learn how to use GitHub's Spec-Kit to plan and execute a modernization task: upgrading the Contoso University application from .NET 6.0 to the latest .NET version. This introduces you to Spec-Driven Development, where you define specifications first, then let AI tools help with implementation.

## Learning Objectives

- Understand the Spec-Kit workflow and principles
- Learn how to create effective specifications for modernization tasks
- Use GitHub Copilot with Spec-Kit for systematic code updates
- Practice validation and testing after major framework upgrades

## Prerequisites

- Completed the main setup from README.md
- [GitHub Copilot](https://github.com/features/copilot) enabled in your IDE (VS Code, Visual Studio, or JetBrains)
- Familiarity with .NET development

## Important Note

This lab uses **GitHub Copilot** as your AI coding assistant. Make sure you have:
- GitHub Copilot subscription activated
- Copilot extension installed in your editor
- Copilot enabled and signed in

## Duration

Approximately 60-90 minutes

---

## Part 1: Setting Up Spec-Kit

### Step 1: Install Spec-Kit

```bash
# Install the Spec-Kit CLI
pip install specify-cli

# Verify installation
specify --version
```

### Step 2: Initialize Spec-Kit in Your Project

```bash
# From the repository root
specify init
```

This creates:
- `specs/` directory for your specifications
- `memory/constitution.md` for project rules and principles
- Context files for AI assistance (can be used with GitHub Copilot)
- Helper scripts in `scripts/`

**Note:** While Spec-Kit was originally designed for Claude, it works excellently with GitHub Copilot as well. The methodology and structure are AI-agnostic.

### Step 3: Review the Constitution

Open `memory/constitution.md` and familiarize yourself with the project's guiding principles. This file helps maintain consistency across all AI-assisted development.

---

## Part 2: Creating a Specification for .NET Upgrade

### Step 1: Create a New Feature Branch

```bash
git checkout -b feature/upgrade-dotnet
```

### Step 2: Use Spec-Kit to Plan

Run the planning command:

```bash
/speckit.plan
```

Or manually create a spec file at `specs/001-upgrade-dotnet/spec.md`:

```markdown
# Upgrade Contoso University to .NET 8

## Problem Statement

The Contoso University application currently runs on .NET 6.0, which will reach end of support soon. We need to upgrade to .NET 8 to:
- Benefit from performance improvements
- Access new language features
- Ensure long-term support and security updates
- Maintain compatibility with modern tooling

## Scope

### In Scope
- Upgrade .csproj target framework to net8.0
- Update all NuGet packages to .NET 8 compatible versions
- Update EntityFramework Core to version 8.x
- Test all existing functionality
- Update documentation

### Out of Scope
- Adding new features
- Changing application architecture
- UI redesign

## Success Criteria

1. Application builds successfully with .NET 8 SDK
2. All migrations run without errors
3. All CRUD operations work (Students, Courses, Instructors, Departments)
4. No breaking changes in existing functionality
5. Application starts and runs on both Mac and Windows

## Technical Considerations

### Dependencies to Update
- Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore: 6.0.2 → 8.0.x
- Microsoft.EntityFrameworkCore.SqlServer: 6.0.2 → 8.0.x
- Microsoft.EntityFrameworkCore.Tools: 6.0.2 → 8.0.x
- Microsoft.VisualStudio.Web.CodeGeneration.Design: 6.0.2 → 8.0.x

### Potential Breaking Changes
- Review Entity Framework Core 8 breaking changes
- Check for deprecated APIs in ASP.NET Core 8
- Validate Razor Pages compatibility

### Testing Strategy
1. Clean build verification
2. Database migration verification
3. Manual testing of all CRUD operations
4. Verify pagination still works
5. Check error handling pages
```

### Step 3: Research with Spec-Kit

In your IDE with GitHub Copilot, ask Copilot Chat to research specific concerns:

```
I want you to research the breaking changes between .NET 6 and .NET 8, 
specifically for ASP.NET Core Razor Pages and Entity Framework Core. 
Focus on changes that would affect this Contoso University application.
Create a research.md document with your findings.
```

This will help document findings in `specs/001-upgrade-dotnet/research.md`.

---

## Part 3: Implementation with AI Assistance

### Step 1: Generate Implementation Plan

Use the `/speckit.tasks` command to break down the upgrade into tasks:

```bash
/speckit.tasks
```

This creates `specs/001-upgrade-dotnet/tasks.md` with ordered tasks.

### Step 2: Execute the Upgrade

In GitHub Copilot Chat, use the `/speckit.implement` command or ask:

```
Following the spec in specs/001-upgrade-dotnet/spec.md, 
upgrade the ContosoUniversity.csproj file to target .NET 8 
and update all package references to their .NET 8 versions.
```

### Step 3: Verify the Changes

GitHub Copilot should have updated the `.csproj` file with:
- `<TargetFramework>net8.0</TargetFramework>`
- Updated package versions (8.0.x)

### Step 4: Build and Test

```bash
cd ContosoUniversity

# Restore packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

### Step 5: Test Database Operations

1. Navigate to Students page - verify listing works
2. Create a new student - verify creation
3. Edit a student - verify update
4. Delete a student - verify deletion
5. Repeat for Courses, Instructors, and Departments

---

## Part 4: Validation and Documentation

### Step 1: Validate Against Success Criteria

Review your spec's success criteria and verify each one:

- [ ] Application builds successfully with .NET 8 SDK
- [ ] All migrations run without errors
- [ ] All CRUD operations work
- [ ] No breaking changes in existing functionality
- [ ] Application runs on both platforms

### Step 2: Update Documentation

Update any version-specific documentation in the repository.

### Step 3: Commit Your Changes

```bash
git add .
git commit -m "Upgrade to .NET 8

- Updated target framework to net8.0
- Upgraded all NuGet packages to .NET 8 versions
- Verified all functionality works
- Updated documentation

Follows spec: specs/001-upgrade-dotnet/spec.md"
```

---

## Key Takeaways

1. **Spec-First Approach**: Writing specifications before coding ensures clarity and alignment
2. **AI as Assistant**: GitHub Copilot can execute well-defined specs systematically
3. **Documentation**: Specs serve as living documentation of decisions and changes
4. **Validation**: Success criteria ensure nothing is missed during implementation

## Challenge Extensions

1. **Performance Comparison**: Measure application startup time before and after upgrade
2. **Feature Exploration**: Research one new .NET 8 feature and add it to the application
3. **Migration Path**: Create a spec for upgrading from .NET 8 to .NET 9 (practice the process)

## Next Steps

Proceed to **Lab 2: UI Modernization** to learn how to use Spec-Kit for larger architectural changes, or explore the optional labs for additional features.

## Resources

- [.NET 8 Release Notes](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-8)
- [EF Core 8 Breaking Changes](https://learn.microsoft.com/ef/core/what-is-new/ef-core-8.0/breaking-changes)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)

