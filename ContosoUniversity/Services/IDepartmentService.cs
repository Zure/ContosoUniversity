#nullable enable
// T106-T107: Department service interface and implementation
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Services;

/// <summary>
/// Service interface for managing department operations
/// </summary>
public interface IDepartmentService
{
    /// <summary>
    /// Get all departments with pagination
    /// </summary>
    Task<PaginatedResponseDto<DepartmentDto>> GetDepartmentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null);

    /// <summary>
    /// Get department by ID
    /// </summary>
    Task<DepartmentDto?> GetDepartmentByIdAsync(int id);

    /// <summary>
    /// Create a new department
    /// </summary>
    Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto);

    /// <summary>
    /// Update department
    /// </summary>
    Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto);

    /// <summary>
    /// Delete department
    /// </summary>
    Task<bool> DeleteDepartmentAsync(int id);

    /// <summary>
    /// Check if department can be deleted (no courses assigned)
    /// </summary>
    Task<bool> CanDeleteDepartmentAsync(int id);
}
