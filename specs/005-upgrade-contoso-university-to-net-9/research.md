# Research: .NET 9 Upgrade for Contoso University

**Created**: 2025-12-08  
**Purpose**: Identify breaking changes and compatibility issues for upgrading from .NET 6 to .NET 9

## Key Breaking Changes

### .NET Core/ASP.NET Core Changes

**Target Framework Updates:**
- Change from `net6.0` to `net9.0` in project files
- C# language version automatically updated to C# 12

**ASP.NET Core 9.0 Breaking Changes:**
- Minimal APIs: New routing behavior (not applicable - using Razor Pages)
- Authentication: Some middleware ordering requirements
- Razor Pages: Generally backward compatible
- Static files: No major breaking changes expected

### Entity Framework Core 9.0

**Major Changes:**
- Improved LINQ translation
- Better performance for bulk operations
- New mapping capabilities
- Breaking changes in query behavior (rare)

**Compatibility Assessment:**
- Basic CRUD operations: ✅ Expected to work
- Migrations: ✅ Should be compatible
- Relationships: ✅ No breaking changes for simple relationships
- Concurrency tokens: ✅ RowVersion pattern unchanged

### Package Compatibility Matrix

**Core Packages (Target Versions):**
- `Microsoft.AspNetCore.App` framework reference → 9.0.x
- `Microsoft.EntityFrameworkCore.SqlServer` → 9.0.0
- `Microsoft.EntityFrameworkCore.Tools` → 9.0.0
- `Microsoft.EntityFrameworkCore.Design` → 9.0.0

**Assessment: LOW RISK**
- Standard web app pattern
- No exotic features used
- Simple entity relationships
- Standard Razor Pages approach

## Migration Strategy

1. **Phase 1**: Update project file and core packages
2. **Phase 2**: Test build and resolve compilation errors
3. **Phase 3**: Test runtime and database operations
4. **Phase 4**: Validate all CRUD operations

## Potential Issues & Solutions

**Issue**: Package version conflicts  
**Solution**: Use `dotnet list package --outdated` to identify conflicts

**Issue**: Migration failures  
**Solution**: Test migrations on backup database first

**Issue**: Runtime API changes  
**Solution**: Review compiler warnings and update deprecated APIs

**Issue**: Performance regressions  
**Solution**: Benchmark before/after upgrade

## References

- [.NET 9 Release Notes](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- [ASP.NET Core 9.0 Breaking Changes](https://learn.microsoft.com/en-us/aspnet/core/migration/80-to-90)
- [EF Core 9.0 Breaking Changes](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)