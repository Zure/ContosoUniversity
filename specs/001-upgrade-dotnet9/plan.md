# Upgrade Plan: .NET 6 to .NET 9

## Steps
1. Research .NET 9 and EF Core 9 breaking changes
2. Audit project files for .NET 6-specific code or dependencies
3. Update TargetFramework in ContosoUniversity.csproj to net9.0
4. Update NuGet package references to latest .NET 9-compatible versions
5. Review and update code for breaking changes and deprecated APIs
6. Restore and build the project
7. Run and validate all unit and integration tests
8. Verify application functionality (CRUD for Students, Courses, Instructors, Departments)
9. Update documentation to reference .NET 9
10. Commit and push changes to feature branch
