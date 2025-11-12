// T081-T082: Enrollment service interface and implementation
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Services;

/// <summary>
/// Service interface for managing enrollment operations
/// </summary>
public interface IEnrollmentService
{
    /// <summary>
    /// Get all enrollments with optional filtering by student or course
    /// </summary>
    Task<PaginatedResponseDto<EnrollmentDto>> GetEnrollmentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        int? studentId = null,
        int? courseId = null);

    /// <summary>
    /// Get enrollment by ID
    /// </summary>
    Task<EnrollmentDto?> GetEnrollmentByIdAsync(int id);

    /// <summary>
    /// Create a new enrollment
    /// </summary>
    Task<EnrollmentDto> CreateEnrollmentAsync(CreateEnrollmentDto dto);

    /// <summary>
    /// Update enrollment (primarily for grade updates)
    /// </summary>
    Task<EnrollmentDto?> UpdateEnrollmentAsync(int id, UpdateEnrollmentDto dto);

    /// <summary>
    /// Delete enrollment
    /// </summary>
    Task<bool> DeleteEnrollmentAsync(int id);

    /// <summary>
    /// Check if an enrollment already exists for a student in a course
    /// </summary>
    Task<bool> EnrollmentExistsAsync(int studentId, int courseId, int? excludeEnrollmentId = null);
}
