# Quickstart: Upgrade Contoso University to .NET 9

## Prerequisites
- .NET 9.0 SDK installed
- SQL Server running (Docker/Podman)
- GitHub Copilot enabled (optional, recommended)

## Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ContosoUniversity
   ```

2. **Switch to upgrade branch**
   ```bash
   git checkout 002-upgrade-contoso-university-to-net-9
   ```

3. **Update dependencies**
   - Open `ContosoUniversity.csproj`
   - Change `<TargetFramework>` to `net9.0`
   - Update all NuGet package references to latest .NET 9-compatible versions

4. **Restore and build**
   ```bash
   dotnet restore
   dotnet build
   ```

5. **Run Entity Framework migrations**
   ```bash
   dotnet ef database update
   ```

6. **Run the application**
   ```bash
   dotnet run
   ```
   - App should be available at `https://localhost:7054` or `http://localhost:5054`

7. **Test CRUD operations**
   - Navigate to Students, Courses, Instructors, Departments
   - Create, edit, delete entities and verify changes

8. **Update documentation**
   - Ensure README and setup instructions reference .NET 9

## Troubleshooting
- If build fails, check for incompatible NuGet packages and update/remove as needed
- If migrations fail, review EF Core 9 breaking changes and update code accordingly
- If app does not start, check connection strings and environment variables

## Resources
- [.NET 9 Release Notes](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
- [EF Core 9 Breaking Changes](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)
- [GitHub Spec-Kit Documentation](https://github.com/github/spec-kit)
