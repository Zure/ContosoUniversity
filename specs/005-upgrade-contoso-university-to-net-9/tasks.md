# Tasks: Upgrade Contoso University to .NET 9

**Input**: Design documents from `/specs/005-upgrade-contoso-university-to-net-9/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Research .NET 9 breaking changes and EF Core 9 compatibility issues
- [ ] T002 [P] Backup current database schema and data for rollback safety
- [ ] T003 [P] Document current package versions in ContosoUniversity/ContosoUniversity.csproj

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Update target framework to net9.0 in ContosoUniversity/ContosoUniversity.csproj
- [X] T005 Update Microsoft.AspNetCore package references to 9.0.x versions
- [X] T006 Update Microsoft.EntityFrameworkCore packages to 9.0.x versions
- [X] T007 [P] Update other NuGet dependencies to .NET 9 compatible versions
- [X] T008 Resolve any package conflicts or breaking changes in project file

---

## Phase 3: User Story 1 - Application runs on .NET 9 (Priority: P1)

**Story Goal**: Build and run the application successfully on .NET 9 SDK
**Independent Test**: `dotnet build && dotnet run` succeeds, main pages load

- [ ] T009 [US1] Build project with `dotnet build` and resolve compilation errors
- [ ] T010 [US1] Start application with `dotnet run` and verify startup succeeds
- [ ] T011 [US1] Test navigation to main pages (Students, Courses, Instructors, Departments)
- [ ] T012 [US1] Document any runtime warnings or deprecated API usage

---

## Phase 4: User Story 2 - Database migrations work after upgrade (Priority: P2)

**Story Goal**: All EF Core migrations run successfully with no data loss
**Independent Test**: Run migrations, verify schema integrity and data preservation

- [ ] T013 [US2] Test existing migrations with `dotnet ef database update`
- [ ] T014 [US2] Verify database schema matches expected structure after migrations
- [ ] T015 [US2] Validate that existing data is preserved and accessible
- [ ] T016 [US2] Test rollback capabilities if migration issues occur

---

## Phase 5: User Story 3 - All CRUD operations work post-upgrade (Priority: P3)

**Story Goal**: Create, Read, Update, Delete operations work for all entities
**Independent Test**: Perform CRUD on Students, Courses, Instructors, Departments

- [ ] T017 [US3] Test Student CRUD operations (Create, Read, Update, Delete)
- [ ] T018 [P] [US3] Test Course CRUD operations (Create, Read, Update, Delete)
- [ ] T019 [P] [US3] Test Instructor CRUD operations (Create, Read, Update, Delete)
- [ ] T020 [P] [US3] Test Department CRUD operations (Create, Read, Update, Delete)
- [ ] T021 [US3] Verify relationships between entities still work correctly
- [ ] T022 [US3] Test pagination and search functionality if present

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [ ] T023 [P] Update README.md to reflect .NET 9 requirements
- [ ] T024 [P] Document upgrade steps and any breaking changes encountered
- [ ] T025 Performance test: Compare startup time and page load speed with baseline
- [ ] T026 Run full regression test suite if available
- [ ] T027 Create commit with descriptive message following spec guidelines

---

## Dependencies

**Story Completion Order:**
1. Setup + Foundational (T001-T008) → US1 (T009-T012)
2. US1 completion → US2 (T013-T016) 
3. US2 completion → US3 (T017-T022)
4. All user stories → Final Phase (T023-T027)

## Parallel Execution Examples

**Phase 1 & 2**: T002, T003, T007 can run in parallel  
**Phase 5**: T018, T019, T020 can run in parallel after T017 succeeds  
**Final Phase**: T023, T024, T025 can run in parallel

## Implementation Strategy

- **MVP Scope**: Complete Phase 1-3 (US1) for basic .NET 9 functionality  
- **Full Feature**: Complete all phases for comprehensive upgrade validation  
- **Incremental Delivery**: Each completed user story provides demonstrable value

**Total Tasks**: 27  
**Task Count per Story**: Setup(3) + Foundation(5) + US1(4) + US2(4) + US3(6) + Polish(5)  
**Parallel Opportunities**: 8 tasks can run in parallel within their phases  
**Independent Test Criteria**: Each user story has clear pass/fail validation steps