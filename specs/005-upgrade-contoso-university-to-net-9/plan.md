# Implementation Plan: Upgrade Contoso University to .NET 9

**Branch**: `005-upgrade-contoso-university-to-net-9` | **Date**: 2025-12-08 | **Spec**: [spec.md]
**Input**: Feature specification from `/specs/005-upgrade-contoso-university-to-net-9/spec.md`

## Summary

Upgrade the Contoso University application from .NET 6 to .NET 9. This includes updating all project files and NuGet dependencies, validating Entity Framework Core migrations, and ensuring all CRUD operations work for Students, Courses, Instructors, and Departments. The upgrade must not introduce any loss of functionality or data. All changes will be validated through build, migration, and functional tests.

## Technical Context

**Language/Version**: C# 12, .NET 9.0  
**Primary Dependencies**: ASP.NET Core, Entity Framework Core 9, SQL Server, Razor Pages  
**Storage**: SQL Server (local or containerized)  
**Testing**: xUnit, EF Core migration tests, manual functional validation  
**Target Platform**: Linux, Windows (cross-platform)  
**Project Type**: Web application (single repo)  
**Performance Goals**: No regression in page load or CRUD latency  
**Constraints**: Must pass all existing tests, no breaking changes to public APIs, maintain compatibility with containerized SQL Server  
**Scale/Scope**: ~10 main entities, 4 CRUD screens, <100k LOC

## Constitution Check

- Modernization-First: All code must be updated to .NET 9 and best practices
- Test-Driven: All changes must be validated by tests
- Integration: All migrations and CRUD flows must be tested
- Documentation: All upgrade steps and breaking changes must be documented

## Project Structure

### Documentation (this feature)

```
specs/005-upgrade-contoso-university-to-net-9/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```
ContosoUniversity/
├── *.csproj
├── Models/
├── Data/
├── Pages/
├── Migrations/
└── wwwroot/
```

## Risks & Mitigations

- **NuGet incompatibility**: Validate all packages for .NET 9 support before upgrade
- **EF Core breaking changes**: Review [EF Core 9 Breaking Changes](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)
- **Migration failures**: Backup database and test migrations in staging
- **Loss of functionality**: Run full regression suite and manual CRUD tests

## Next Steps

1. Research breaking changes and update plan (see research.md)
2. Update all project files and dependencies
3. Validate migrations and CRUD operations
4. Document upgrade steps and issues
5. Review and merge changes after successful validation
