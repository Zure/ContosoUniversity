#nullable enable
// T133: Instructor service implementation
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;

namespace ContosoUniversity.Services;

/// <summary>
/// Service for managing instructor operations
/// </summary>
public class InstructorService : IInstructorService
{
    private readonly SchoolContext _context;
    private readonly ILogger<InstructorService> _logger;

    public InstructorService(SchoolContext context, ILogger<InstructorService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<InstructorDto>> GetInstructorsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null)
    {
        _logger.LogInformation(
            "Getting instructors - Page: {PageNumber}, PageSize: {PageSize}, Search: {SearchString}",
            pageNumber, pageSize, searchString);

        var query = _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
                .ThenInclude(c => c.Department)
            .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(searchString))
        {
            query = query.Where(i =>
                i.LastName.Contains(searchString) ||
                i.FirstMidName.Contains(searchString));
        }

        var totalCount = await query.CountAsync();

        var instructors = await query
            .OrderBy(i => i.LastName)
            .ThenBy(i => i.FirstMidName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => i.ToDto())
            .ToListAsync();

        return new PaginatedResponseDto<InstructorDto>
        {
            Data = instructors,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<InstructorDto?> GetInstructorByIdAsync(int id)
    {
        _logger.LogInformation("Getting instructor with ID: {InstructorId}", id);

        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
                .ThenInclude(c => c.Department)
            .FirstOrDefaultAsync(i => i.ID == id);

        return instructor?.ToDto();
    }

    public async Task<InstructorDto> CreateInstructorAsync(CreateInstructorDto dto)
    {
        _logger.LogInformation("Creating instructor: {LastName}, {FirstName}",
            dto.LastName, dto.FirstMidName);

        var instructor = dto.ToEntity();

        // Add office assignment if provided
        if (!string.IsNullOrWhiteSpace(dto.OfficeLocation))
        {
            instructor.OfficeAssignment = new OfficeAssignment
            {
                Location = dto.OfficeLocation
            };
        }

        // Add course assignments
        if (dto.CourseIDs.Any())
        {
            var courses = await _context.Courses
                .Where(c => dto.CourseIDs.Contains(c.CourseID))
                .ToListAsync();

            instructor.Courses = courses;
        }

        _context.Instructors.Add(instructor);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        await _context.Entry(instructor)
            .Reference(i => i.OfficeAssignment)
            .LoadAsync();
        await _context.Entry(instructor)
            .Collection(i => i.Courses)
            .Query()
            .Include(c => c.Department)
            .LoadAsync();

        _logger.LogInformation("Instructor created with ID: {InstructorId}", instructor.ID);
        return instructor.ToDto();
    }

    public async Task<InstructorDto?> UpdateInstructorAsync(int id, UpdateInstructorDto dto)
    {
        _logger.LogInformation("Updating instructor with ID: {InstructorId}", id);

        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
                .ThenInclude(c => c.Department)
            .FirstOrDefaultAsync(i => i.ID == id);

        if (instructor == null)
        {
            _logger.LogWarning("Instructor with ID {InstructorId} not found", id);
            return null;
        }

        instructor.UpdateFromDto(dto);

        // Update office assignment
        if (!string.IsNullOrWhiteSpace(dto.OfficeLocation))
        {
            if (instructor.OfficeAssignment == null)
            {
                instructor.OfficeAssignment = new OfficeAssignment
                {
                    InstructorID = id,
                    Location = dto.OfficeLocation
                };
            }
            else
            {
                instructor.OfficeAssignment.Location = dto.OfficeLocation;
            }
        }
        else
        {
            // Remove office assignment if location is cleared
            if (instructor.OfficeAssignment != null)
            {
                _context.OfficeAssignments.Remove(instructor.OfficeAssignment);
                instructor.OfficeAssignment = null;
            }
        }

        // Update course assignments
        var currentCourseIds = instructor.Courses.Select(c => c.CourseID).ToList();
        var newCourseIds = dto.CourseIDs;

        // Remove courses that are no longer assigned
        var coursesToRemove = instructor.Courses
            .Where(c => !newCourseIds.Contains(c.CourseID))
            .ToList();
        foreach (var course in coursesToRemove)
        {
            instructor.Courses.Remove(course);
        }

        // Add new course assignments
        var courseIdsToAdd = newCourseIds.Except(currentCourseIds).ToList();
        if (courseIdsToAdd.Any())
        {
            var coursesToAdd = await _context.Courses
                .Include(c => c.Department)
                .Where(c => courseIdsToAdd.Contains(c.CourseID))
                .ToListAsync();

            foreach (var course in coursesToAdd)
            {
                instructor.Courses.Add(course);
            }
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Instructor updated successfully: {InstructorId}", id);
        return instructor.ToDto();
    }

    public async Task<bool> DeleteInstructorAsync(int id)
    {
        _logger.LogInformation("Deleting instructor with ID: {InstructorId}", id);

        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .FirstOrDefaultAsync(i => i.ID == id);

        if (instructor == null)
        {
            _logger.LogWarning("Instructor with ID {InstructorId} not found", id);
            return false;
        }

        // Check if instructor is a department administrator
        var isDepartmentAdmin = await _context.Departments
            .AnyAsync(d => d.InstructorID == id);

        if (isDepartmentAdmin)
        {
            throw new InvalidOperationException(
                "Cannot delete instructor. This instructor is a department administrator.");
        }

        // Office assignment will be deleted automatically due to cascade delete
        _context.Instructors.Remove(instructor);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Instructor deleted successfully: {InstructorId}", id);
        return true;
    }

    public async Task<bool> CanDeleteInstructorAsync(int id)
    {
        var isDepartmentAdmin = await _context.Departments
            .AnyAsync(d => d.InstructorID == id);

        return !isDepartmentAdmin;
    }
}
