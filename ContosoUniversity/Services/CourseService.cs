// T057: Course service implementation with EF Core
#nullable enable
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;
using Microsoft.EntityFrameworkCore;

namespace ContosoUniversity.Services;

/// <summary>
/// Service implementation for Course operations
/// </summary>
public class CourseService : ICourseService
{
    private readonly SchoolContext _context;
    private readonly ILogger<CourseService> _logger;

    public CourseService(SchoolContext context, ILogger<CourseService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<CourseDto>> GetCoursesAsync(
        int pageNumber = 1,
        int pageSize = 10,
        int? departmentId = null,
        string? searchString = null)
    {
        var query = _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Enrollments)
            .AsQueryable();

        // Apply department filter if provided
        if (departmentId.HasValue)
        {
            query = query.Where(c => c.DepartmentID == departmentId.Value);
        }

        // Apply search filter if provided
        if (!string.IsNullOrWhiteSpace(searchString))
        {
            query = query.Where(c => c.Title.Contains(searchString));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Calculate pagination metadata
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Apply pagination and ordering
        var courses = await query
            .OrderBy(c => c.CourseID)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var courseDtos = courses.Select(c => c.ToDto()).ToList();

        return new PaginatedResponseDto<CourseDto>
        {
            Data = courseDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    public async Task<CourseDto?> GetCourseByIdAsync(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        return course?.ToDto();
    }

    public async Task<CourseDto> CreateCourseAsync(CreateCourseDto createDto)
    {
        // Check if course number already exists
        var existingCourse = await _context.Courses
            .FirstOrDefaultAsync(c => c.CourseID == createDto.CourseNumber);

        if (existingCourse != null)
        {
            throw new InvalidOperationException(
                $"Course number {createDto.CourseNumber} already exists");
        }

        // Validate department exists
        var departmentExists = await _context.Departments
            .AnyAsync(d => d.DepartmentID == createDto.DepartmentId);

        if (!departmentExists)
        {
            throw new KeyNotFoundException(
                $"Department with ID {createDto.DepartmentId} not found");
        }

        var course = createDto.ToEntity();

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created course {CourseId}: {Title}",
            course.CourseID, course.Title);

        // Reload with department and enrollments
        var createdCourse = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Enrollments)
            .FirstAsync(c => c.CourseID == course.CourseID);

        return createdCourse.ToDto();
    }

    public async Task<CourseDto> UpdateCourseAsync(int id, UpdateCourseDto updateDto)
    {
        var course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (course == null)
        {
            throw new KeyNotFoundException($"Course with ID {id} not found");
        }

        // Validate department exists
        var departmentExists = await _context.Departments
            .AnyAsync(d => d.DepartmentID == updateDto.DepartmentId);

        if (!departmentExists)
        {
            throw new KeyNotFoundException(
                $"Department with ID {updateDto.DepartmentId} not found");
        }

        // Update properties
        course.UpdateFromDto(updateDto);

        try
        {
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated course {CourseId}: {Title}",
                course.CourseID, course.Title);

            return course.ToDto();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            var exists = await _context.Courses.AnyAsync(c => c.CourseID == id);
            if (!exists)
            {
                throw new KeyNotFoundException($"Course with ID {id} was deleted by another user");
            }

            _logger.LogWarning(ex, "Concurrency conflict updating course {CourseId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteCourseAsync(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (course == null)
        {
            return false;
        }

        // Check if course has enrollments
        if (course.Enrollments?.Any() == true)
        {
            throw new InvalidOperationException(
                $"Cannot delete course {course.Title} because it has {course.Enrollments.Count} enrollment(s). " +
                "Remove enrollments first.");
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted course {CourseId}: {Title}",
            id, course.Title);

        return true;
    }

    public async Task<bool> CanDeleteCourseAsync(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (course == null)
        {
            return false;
        }

        return course.Enrollments?.Any() != true;
    }
}
