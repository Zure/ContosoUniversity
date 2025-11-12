#nullable enable
// T132-T133: Instructor service interface and implementation
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Services;

/// <summary>
/// Service interface for managing instructor operations
/// </summary>
public interface IInstructorService
{
    /// <summary>
    /// Get all instructors with pagination
    /// </summary>
    Task<PaginatedResponseDto<InstructorDto>> GetInstructorsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null);

    /// <summary>
    /// Get instructor by ID with course assignments
    /// </summary>
    Task<InstructorDto?> GetInstructorByIdAsync(int id);

    /// <summary>
    /// Create a new instructor
    /// </summary>
    Task<InstructorDto> CreateInstructorAsync(CreateInstructorDto dto);

    /// <summary>
    /// Update instructor
    /// </summary>
    Task<InstructorDto?> UpdateInstructorAsync(int id, UpdateInstructorDto dto);

    /// <summary>
    /// Delete instructor
    /// </summary>
    Task<bool> DeleteInstructorAsync(int id);

    /// <summary>
    /// Check if instructor can be deleted (not a department administrator)
    /// </summary>
    Task<bool> CanDeleteInstructorAsync(int id);
}
