# Data Model: Upgrade Contoso University to .NET 9

## Entities

### Student
- **ID**: int, primary key
- **Name**: string, required
- **EnrollmentDate**: DateTime, required
- **Enrollments**: List<Enrollment> (relationship)

### Course
- **ID**: int, primary key
- **Title**: string, required
- **Credits**: int, required
- **DepartmentID**: int, foreign key
- **Enrollments**: List<Enrollment> (relationship)
- **Department**: Department (relationship)

### Instructor
- **ID**: int, primary key
- **Name**: string, required
- **HireDate**: DateTime, required
- **Courses**: List<Course> (relationship)
- **OfficeAssignment**: OfficeAssignment (optional relationship)

### Department
- **ID**: int, primary key
- **Name**: string, required
- **Budget**: decimal, required
- **StartDate**: DateTime, required
- **AdministratorID**: int, foreign key (optional)
- **Courses**: List<Course> (relationship)

### Enrollment
- **ID**: int, primary key
- **CourseID**: int, foreign key
- **StudentID**: int, foreign key
- **Grade**: string (A, B, C, D, F, optional)
- **Course**: Course (relationship)
- **Student**: Student (relationship)

### OfficeAssignment
- **InstructorID**: int, primary key, foreign key
- **Location**: string, required
- **Instructor**: Instructor (relationship)

## Relationships
- **Student ↔ Enrollment ↔ Course**: Many-to-many via Enrollment
- **Course ↔ Department**: Many-to-one
- **Instructor ↔ Course**: Many-to-many
- **Instructor ↔ OfficeAssignment**: One-to-one (optional)
- **Department ↔ Course**: One-to-many

## Validation Rules
- All required fields must be present
- Foreign keys must reference valid entities
- Grade must be one of [A, B, C, D, F] or null
- Budget must be non-negative
- Dates must be valid and not in the future

## State Transitions
- **Student**: Created → Enrolled → Updated → Deleted
- **Course**: Created → Assigned → Updated → Deleted
- **Instructor**: Created → Assigned → Updated → Deleted
- **Department**: Created → Updated → Deleted
- **Enrollment**: Created → Updated → Deleted
- **OfficeAssignment**: Created → Updated → Deleted

## Notes
- No schema changes required for .NET 9 upgrade, but all migrations must be validated for compatibility.
- Relationships and validation rules must be preserved post-upgrade.
