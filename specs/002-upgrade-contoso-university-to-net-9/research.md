# Research: Upgrade Contoso University to .NET 9

## Decision: Upgrade to .NET 9
- **Rationale**: .NET 9 provides latest features, performance, and security. Ensures long-term support and compatibility.
- **Alternatives considered**: Remain on .NET 6 (LTS, but missing new features), upgrade to .NET 8 (intermediate step, but not future-proof).

## Decision: Update all NuGet dependencies to .NET 9-compatible versions
- **Rationale**: Prevents runtime errors and leverages new APIs. Ensures compatibility with .NET 9 runtime and SDK.
- **Alternatives considered**: Pin to older package versions (risk of incompatibility), update only critical packages (risk of partial upgrade issues).

## Decision: Validate Entity Framework Core migrations
- **Rationale**: EF Core 9 may introduce breaking changes. Ensures database schema remains consistent and upgrade does not break data access.
- **Alternatives considered**: Skip migration validation (risk of data loss or schema mismatch), manual DB updates (error-prone).

## Decision: Manual and automated CRUD testing
- **Rationale**: Ensures all core features work post-upgrade. Validates that no regressions are introduced.
- **Alternatives considered**: Rely only on automated tests (may miss UI/UX issues), skip manual testing (risk of missed bugs).

## Decision: Update documentation for .NET 9
- **Rationale**: Keeps onboarding and maintenance clear. Ensures all users and developers follow correct setup.
- **Alternatives considered**: Leave docs unchanged (risk of confusion, onboarding errors).

## Breaking Changes and Compatibility
- Review [.NET 9 Release Notes](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- Review [EF Core 9 Breaking Changes](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)
- Validate all custom code and third-party packages for compatibility

## Testing Strategy
- Build and run on .NET 9 SDK
- Run all migrations and validate schema
- Perform CRUD operations for all main entities
- Update and verify documentation

## Risks
- NuGet package incompatibility
- Undocumented breaking changes in .NET or EF Core
- Missed manual test cases

## Mitigation
- Pin and update all packages
- Review official release notes
- Manual and automated testing
- Update documentation and onboarding guides
