# Data Model Overview

## Entities
- Student
- Course
- Instructor
- Department
- Enrollment

## Relationships
- Students enroll in Courses (many-to-many via Enrollment)
- Courses are assigned to Instructors (many-to-many)
- Courses belong to Departments (one-to-many)
- Instructors may belong to Departments (one-to-many)

## Notes
- Entity classes are defined in the Models folder
- Relationships are managed via navigation properties and EF Core configuration
