# Database Backup Documentation

**Created**: 2025-12-08  
**Purpose**: Document current database state before .NET 9 upgrade for rollback safety

## Current Migration State

**Migration Files Present:**
- `20220226005057_InitialCreate.cs` - Initial database schema
- `20220226005057_InitialCreate.Designer.cs` - EF model snapshot for InitialCreate
- `20220226012101_RowVersion.cs` - Added row versioning for concurrency
- `20220226012101_RowVersion.Designer.cs` - EF model snapshot for RowVersion
- `SchoolContextModelSnapshot.cs` - Current complete model snapshot

## Database Schema Summary

**Entities (from migration files):**
- Students (ID, LastName, FirstMidName, EnrollmentDate, RowVersion)
- Courses (CourseID, Title, Credits, DepartmentID, RowVersion)
- Enrollments (EnrollmentID, CourseID, StudentID, Grade)
- Instructors (ID, LastName, FirstMidName, HireDate, RowVersion)
- Departments (DepartmentID, Name, Budget, StartDate, InstructorID, RowVersion)
- OfficeAssignments (InstructorID, Location)

**Key Relationships:**
- Students ↔ Enrollments ↔ Courses (many-to-many through Enrollments)
- Instructors → Departments (one-to-many, department admin)
- Instructors → OfficeAssignments (one-to-one)
- Departments → Courses (one-to-many)

**Concurrency Control:**
- RowVersion (timestamp) columns on main entities for optimistic concurrency

## Backup Strategy

**Before Upgrade:**
1. Document current EF model (this file)
2. Export current database if running (not applicable in dev environment)
3. Ensure migrations can be rolled back if needed

**Rollback Plan:**
1. Reset to current commit if code changes fail
2. Use migration rollback: `dotnet ef database update [previous-migration]`
3. Restore from backup if database corruption occurs

**Risk Assessment: LOW**
- Simple schema with standard relationships
- Well-established migration history
- No complex stored procedures or custom SQL
- Standard EF Core patterns used throughout