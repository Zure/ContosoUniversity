// T056: Course service interface
#nullable enable
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Services;

/// <summary>
/// Service interface for Course operations
/// </summary>
public interface ICourseService
{
    /// <summary>
    /// Get paginated list of courses with optional department filter
    /// </summary>
    Task<PaginatedResponseDto<CourseDto>> GetCoursesAsync(
        int pageNumber = 1,
        int pageSize = 10,
        int? departmentId = null,
        string? searchString = null);

    /// <summary>
    /// Get a single course by ID
    /// </summary>
    Task<CourseDto?> GetCourseByIdAsync(int id);

    /// <summary>
    /// Create a new course
    /// </summary>
    Task<CourseDto> CreateCourseAsync(CreateCourseDto createDto);

    /// <summary>
    /// Update an existing course
    /// </summary>
    Task<CourseDto> UpdateCourseAsync(int id, UpdateCourseDto updateDto);

    /// <summary>
    /// Delete a course
    /// </summary>
    Task<bool> DeleteCourseAsync(int id);

    /// <summary>
    /// Check if a course can be deleted (has no enrollments)
    /// </summary>
    Task<bool> CanDeleteCourseAsync(int id);
}
