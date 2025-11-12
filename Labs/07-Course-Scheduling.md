# Lab 7: Course Scheduling - Adding Dates and Times (Optional)

## Overview

Use Spec-Kit to add course scheduling with dates, times, and locations. This lab shows how to specify complex temporal features and business rules, letting Copilot handle the implementation details.

## Learning Objectives

- Specify temporal data models and business rules
- Define conflict detection requirements clearly
- Let Copilot implement complex date/time logic
- Use specifications to handle edge cases
- Validate scheduling features against criteria

## Prerequisites

- Completed Lab 1 (spec-kit basics)
- GitHub Copilot enabled in your IDE
- Understanding of temporal data
- Completed Lab 6 (optional)

## Duration

Approximately 90-120 minutes

---

## Part 1: Specify Scheduling Requirements

### Step 1: Define the Feature

```bash
/speckit.specify Add course scheduling with semesters, meeting times (days/times), locations, and conflict detection. Courses should have start/end dates, recurring meeting patterns (e.g., MWF 10-11am), room assignments, and validation to prevent instructor and room double-booking.
```

### Step 2: Clarify Temporal Logic

```bash
/speckit.clarify How should we handle timezones? Use DateTime or DateTimeOffset? Define the data model for semesters, course offerings (specific instance of a course in a term), meeting times (recurring patterns), and locations. Research best practices for academic scheduling.
```

### Step 3: Specify Conflict Detection

```bash
/speckit.clarify Define conflict detection rules: What constitutes a conflict? Same instructor, overlapping time? Same room, overlapping time? How to check for overlaps efficiently? Edge cases like courses spanning midnight or daylight saving transitions?
```

---

## Part 2: Plan and Implement

### Step 1: Create Implementation Plan

```bash
/speckit.plan Create a plan for scheduling including: new entities (Semester, CourseOffering, MeetingTime, Location), conflict detection service, scheduling validation, UI for creating course offerings with meeting times, calendar/schedule views, and testing approach for edge cases.
```

### Step 2: Generate and Execute Tasks

```bash
/speckit.tasks
/speckit.implement
```

Copilot will create the entire scheduling system based on your spec.

### Step 3: Guide Complex Logic

```
For conflict detection, create a SchedulingService with a method CheckConflicts(courseOffering) that queries for overlapping times using LINQ. Consider only the same semester and check both day-of-week and time-range overlaps.
```

---

## Part 3: Test Scheduling

### Test Scenarios

1. **Create offering without conflicts**: Should succeed
2. **Create with instructor conflict**: Should be prevented
3. **Create with room conflict**: Should be prevented
4. **Multiple meeting times**: Course meets MWF and also has Thu lab
5. **Edge cases**: Midnight spanning, DST transitions

---

## Key Takeaways

1. **Complex Logic in Specs**: Temporal logic specified, not coded manually
2. **Edge Cases Upfront**: Specify edge cases in requirements
3. **Validation-First**: Define validation rules before implementation

## Next Steps

Continue to **Lab 8: Student Course Registration** to let students enroll!

## Duration

Approximately 90-120 minutes

---

## Part 1: Planning with Spec-Kit

### Step 1: Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/course-scheduling
```

### Step 2: Define the Specification

Ask GitHub Copilot Chat:

```
Help me create a comprehensive specification for adding course scheduling
to Contoso University. Save it as specs/007-course-scheduling/spec.md.

The specification should include:

1. **Problem Statement**: Why we need course scheduling
2. **Current State**: What exists now (courses with no time/date info)
3. **Proposed Features**:
   - Semester/term system (Fall, Spring, Summer)
   - Start and end dates for courses
   - Meeting times (days of week, time slots)
   - Location/room information
   - Recurring meeting patterns
4. **Data Model Changes**: New properties and entities needed
5. **Business Rules**:
   - Courses can't overlap for same instructor
   - Rooms can't be double-booked
   - Meeting times must be within semester dates
6. **UI Requirements**: How users will input and view schedules
7. **Success Criteria**: How we know it's working correctly

Follow spec-kit methodology and be thorough.
```

### Step 3: Research Best Practices

```
Research date/time handling in .NET applications, focusing on:
1. DateTime vs DateTimeOffset (timezone considerations)
2. Recurring event patterns (iCalendar RFC 5545)
3. Conflict detection algorithms
4. UI patterns for date/time input
5. Best practices for academic scheduling systems

Document findings in specs/007-course-scheduling/research.md
```

---

## Part 2: Data Model Design

### Step 1: Define Entities

Ask GitHub Copilot:

```
Based on the specification, help me design the data model for course scheduling.

I need:
1. A Semester/Term entity (Fall 2024, Spring 2025, etc.)
2. CourseOffering entity (specific instance of a course in a term)
3. MeetingTime entity (recurring meeting patterns)
4. Location entity (rooms, buildings)

For each entity, define:
- Properties with appropriate data types
- Navigation properties and relationships
- Validation attributes
- Any computed properties

Show me the complete C# entity classes.
```

### Step 2: Update Course Model

```
The Course entity represents a catalog entry (e.g., "CS 101 Intro to Programming").
A CourseOffering represents a specific instance (e.g., "CS 101 Fall 2024 Section A").

Help me:
1. Update the Course model if needed
2. Create the CourseOffering model with relationship to Course
3. Add proper foreign keys and navigation properties
4. Consider the relationship to Instructor (from Lab 6)

Show me the updated entity models.
```

---

## Part 3: Database Migration

### Step 1: Create Migration with GitHub Copilot

```
Help me create and review an Entity Framework Core migration for the scheduling feature.

Steps:
1. Show me the DbContext changes needed (DbSet declarations, OnModelCreating config)
2. Generate the migration command
3. Review the migration file for correctness
4. Apply the migration
5. Seed sample data for testing

Walk me through each step.
```

### Step 2: Validation

```bash
# After Copilot helps create the migration
cd ContosoUniversity
dotnet ef migrations add AddCourseScheduling
dotnet ef database update
```

Verify the migration with GitHub Copilot:

```
Review my migration file at Migrations/[timestamp]_AddCourseScheduling.cs
Check for:
- Proper foreign key constraints
- Appropriate column types (especially DateTime fields)
- Indexes on frequently queried fields (semester, meeting times)
- Default values where appropriate

Flag any issues.
```

---

## Part 4: Business Logic Implementation

### Step 1: Conflict Detection

Ask GitHub Copilot:

```
Implement a conflict detection service for course scheduling.

Create a service class ConflictDetectionService with methods to check:
1. InstructorTimeConflict(int instructorId, CourseOffering newOffering)
2. RoomConflict(string location, MeetingTime newTime)
3. StudentScheduleConflict(int studentId, CourseOffering newOffering)

Use LINQ to query overlapping time slots. Consider:
- Days of week overlap
- Time range overlap
- Same semester/term

Show me the implementation with proper error handling.
```

### Step 2: Scheduling Rules Validation

```
Create a SchedulingValidator class that validates:
1. Meeting times are within semester start/end dates
2. Meeting times are reasonable (e.g., 8 AM - 10 PM)
3. Course has at least one meeting time
4. All required fields are provided

Use FluentValidation or built-in validation attributes.
Show me the implementation.
```

---

## Part 5: UI Implementation

### Step 1: Create Scheduling Form Specification

```
Create a UI specification (specs/007-course-scheduling/schedule-form-ui.md) for
the course offering creation/edit form. It should include:

1. Semester selection dropdown
2. Date range picker for course start/end
3. Recurring meeting time builder:
   - Days of week checkboxes (Mon, Tue, Wed...)
   - Time range pickers (start time, end time)
   - Add multiple meeting patterns button
4. Location/room input
5. Instructor assignment (if Lab 6 completed)
6. Conflict warnings displayed prominently

Design for usability and clear error messaging.
```

### Step 2: Implement with GitHub Copilot

For Razor Pages approach:

```
Following the UI spec, help me create:
1. Pages/CourseOfferings/Create.cshtml and Create.cshtml.cs
2. The form should use modern HTML5 date/time inputs
3. Include client-side validation
4. Show real-time conflict detection (AJAX call)
5. Use the modernized UI from Lab 5 if completed

Guide me through creating the page model and view step by step.
```

For React approach (if Lab 2 completed):

```
Create a React component for course offering creation with:
1. Form using react-hook-form
2. Date pickers using date-fns and a date picker library
3. Dynamic meeting time fields (add/remove)
4. Real-time conflict detection (API call with debounce)
5. shadcn/ui components if Lab 5 completed

Show me the component structure and API integration.
```

### Step 3: Schedule View/Calendar

```
Help me create a calendar or schedule view that displays:
1. Weekly calendar view showing all course offerings
2. Filtered by semester/term
3. Color-coded by department or instructor
4. Clickable slots showing course details
5. Responsive (list view on mobile)

Suggest libraries:
- React: FullCalendar, React Big Calendar
- Razor Pages: FullCalendar JS with server-side data

Walk me through the implementation.
```

---

## Part 6: API Endpoints (If Lab 2 completed)

### Create REST API for Scheduling

```
Help me create REST API endpoints for course scheduling:

POST   /api/course-offerings           - Create new offering
GET    /api/course-offerings/{id}      - Get offering details
PUT    /api/course-offerings/{id}      - Update offering
DELETE /api/course-offerings/{id}      - Delete offering
GET    /api/course-offerings/semester/{id} - Get offerings by semester
POST   /api/course-offerings/check-conflicts - Check for scheduling conflicts

Include:
- DTOs for request/response
- Conflict detection validation
- Proper error responses
- Swagger documentation

Show me the controller implementation.
```

---

## Part 7: Testing Scenarios

### Create Test Plan with GitHub Copilot

```
Help me create a comprehensive test plan (specs/007-course-scheduling/test-plan.md) covering:

1. **Happy Path Tests**:
   - Create course offering without conflicts
   - Edit existing offering
   - View schedule calendar

2. **Conflict Detection Tests**:
   - Same instructor, overlapping time
   - Same room, overlapping time
   - Student enrolling in conflicting courses

3. **Edge Cases**:
   - Courses spanning midnight
   - Daylight saving time transitions
   - Meeting times outside semester dates
   - Multiple meeting patterns per course

4. **UI Tests**:
   - Form validation messages
   - Calendar rendering
   - Mobile responsiveness

Include test data setup and expected outcomes.
```

### Manual Testing Walkthrough

Test the implementation:

```bash
dotnet run
```

1. Create a new semester/term
2. Create a course offering with meeting times
3. Assign an instructor (if Lab 6 completed)
4. Try creating a conflicting offering (same instructor, same time)
5. Verify conflict is detected and prevented
6. View the schedule calendar
7. Edit an existing offering
8. Delete an offering

---

## Part 8: Advanced Features (Optional)

### Feature 1: Bulk Schedule Creation

```
Create a specification and implementation for bulk schedule creation:

Allow administrators to:
1. Upload CSV with multiple course offerings
2. Parse and validate the data
3. Detect all conflicts before import
4. Preview and confirm import
5. Create all offerings in a transaction

Help me design and implement this feature.
```

### Feature 2: Schedule Templates

```
Implement schedule templates:
1. Save a semester's schedule as a template
2. Apply template to new semester
3. Adjust dates automatically
4. Review and modify before finalizing

This is useful for recurring yearly schedules.
Show me the implementation.
```

### Feature 3: Waitlist and Enrollment Caps

```
Add enrollment management:
1. Max enrollment capacity per offering
2. Waitlist when full
3. Auto-enroll from waitlist when space opens
4. Notifications to students

Integrate with the student enrollment system.
Help me implement this.
```

---

## Key Takeaways

1. **Temporal Data**: DateTime handling requires careful consideration of timezones
2. **Complex Validation**: Conflict detection needs efficient database queries
3. **User Experience**: Good scheduling UI is crucial for usability
4. **Spec-Driven**: Complex features benefit greatly from thorough specifications
5. **AI-Assisted Development**: GitHub Copilot excels at implementing well-specified features

## Challenge Extensions

1. **Mobile App**: Create a mobile-friendly schedule view
2. **iCal Export**: Allow students/instructors to export schedule to calendar apps
3. **Room Resources**: Track room equipment and capacities
4. **Analytics**: Report on room utilization, instructor load
5. **Smart Scheduling**: AI-suggested optimal scheduling to minimize conflicts

## Troubleshooting

### DateTime Timezone Issues

```
Ask GitHub Copilot:
"I'm having timezone issues with course meeting times.
Should I use DateTime or DateTimeOffset? How do I handle
different timezones for online courses?"
```

### Performance Problems with Conflict Detection

```
"My conflict detection queries are slow with many course offerings.
Help me optimize the LINQ queries and add appropriate database indexes."
```

## Resources

- [.NET DateTime Documentation](https://learn.microsoft.com/dotnet/api/system.datetime)
- [EF Core Date/Time Best Practices](https://learn.microsoft.com/ef/core/modeling/entity-properties?tabs=data-annotations%2Cwithout-nrt#datetime-handling)
- [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545)
- [FullCalendar Documentation](https://fullcalendar.io/)

---

Continue to **Lab 8: Course Registration** to allow students to enroll in scheduled courses!
