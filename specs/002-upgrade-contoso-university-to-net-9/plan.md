# Implementation Plan: Upgrade Contoso University to .NET 9

**Branch**: `002-upgrade-contoso-university-to-net-9` | **Date**: 2025-12-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-upgrade-contoso-university-to-net-9/spec.md`

## Summary

Upgrade the Contoso University ASP.NET Core Razor Pages application from .NET 6 to .NET 9. Update all dependencies, ensure all CRUD operations and migrations work, and update documentation. Validate against measurable success criteria and address any breaking changes or compatibility issues.

## Technical Context

**Language/Version**: C# 12, .NET 9.0  
**Primary Dependencies**: ASP.NET Core, Entity Framework Core, Razor Pages, NuGet packages (latest .NET 9-compatible versions)  
**Storage**: SQL Server (via Docker/Podman container)  
**Testing**: xUnit, manual validation, EF migration tests  
**Target Platform**: Linux (Codespace), Windows, MacOS  
**Project Type**: Web application (single repo, Razor Pages)  
**Performance Goals**: No regression; app builds and runs in <1 min, CRUD latency <200ms  
**Constraints**: All features must work post-upgrade, no breaking changes, documentation updated  
**Scale/Scope**: Single application, 4 main entities, typical university workload

## Constitution Check

- Spec-first, test-driven, AI-assisted, documentation, validation, simplicity: All principles followed
- No complexity violations

## Project Structure

### Documentation (this feature)

```
specs/002-upgrade-contoso-university-to-net-9/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```
ContosoUniversity/
├── Models/
├── Data/
├── Pages/
├── Migrations/
├── wwwroot/
├── appsettings.json
├── ContosoUniversity.csproj
└── ...
```

**Structure Decision**: Use existing Razor Pages web app structure. All changes will be made in-place to the main project folder.

## Complexity Tracking

No constitution violations. All changes are justified by upgrade requirements.
