# Spec: Upgrade Contoso University to .NET 9

## Overview
Upgrade the Contoso University Razor Pages application from .NET 6 to .NET 9 to leverage the latest framework features, performance improvements, and long-term support. This includes updating the target framework, NuGet package dependencies, and validating application functionality post-upgrade.

## Motivation
- Ensure compatibility with the latest .NET runtime and libraries
- Benefit from new features and performance enhancements in .NET 9
- Maintain security and supportability

## Scope
- Update all project files to target .NET 9
- Upgrade all NuGet package references to versions compatible with .NET 9
- Validate build, test, and runtime functionality
- Update documentation to reflect .NET 9 usage

## Success Criteria
- Application builds successfully with .NET 9 SDK
- All tests pass and application runs without errors
- All CRUD operations for Students, Courses, Instructors, and Departments work as expected
- Documentation is updated to reference .NET 9

## Out of Scope
- Major refactoring or feature additions
- UI modernization (covered in a separate spec)

## Risks & Mitigations
- **Risk:** Breaking changes in .NET 9 or dependencies
  - **Mitigation:** Review .NET 9 and EF Core 9 breaking changes documentation, run full test suite
- **Risk:** Incompatible third-party packages
  - **Mitigation:** Update or replace packages as needed

## Stakeholders
- Developers
- Workshop participants
- Facilitators

## References
- [.NET 9 Release Notes](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- [EF Core 9 Breaking Changes](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)
