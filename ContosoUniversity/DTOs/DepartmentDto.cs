#nullable enable
// T102-T105: Department DTOs and mappings
using System.ComponentModel.DataAnnotations;
using ContosoUniversity.Models;

namespace ContosoUniversity.DTOs;

/// <summary>
/// DTO for Department data transfer
/// </summary>
public class DepartmentDto
{
    public int DepartmentID { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive number")]
    public decimal Budget { get; set; }

    public DateTime StartDate { get; set; }

    public int? InstructorID { get; set; }

    public string? AdministratorName { get; set; }

    public int CourseCount { get; set; }

    public byte[]? RowVersion { get; set; }
}

/// <summary>
/// DTO for creating a new department
/// </summary>
public class CreateDepartmentDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 50 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Budget is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive number")]
    public decimal Budget { get; set; }

    [Required(ErrorMessage = "Start date is required")]
    public DateTime StartDate { get; set; }

    public int? InstructorID { get; set; }
}

/// <summary>
/// DTO for updating a department
/// </summary>
public class UpdateDepartmentDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 50 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Budget is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive number")]
    public decimal Budget { get; set; }

    [Required(ErrorMessage = "Start date is required")]
    public DateTime StartDate { get; set; }

    public int? InstructorID { get; set; }

    public byte[]? RowVersion { get; set; }
}

/// <summary>
/// Extension methods for mapping between Department entity and DTOs
/// </summary>
public static class DepartmentMappings
{
    /// <summary>
    /// Convert Department entity to DepartmentDto
    /// </summary>
    public static DepartmentDto ToDto(this Department department)
    {
        return new DepartmentDto
        {
            DepartmentID = department.DepartmentID,
            Name = department.Name,
            Budget = department.Budget,
            StartDate = department.StartDate,
            InstructorID = department.InstructorID,
            AdministratorName = department.Administrator != null
                ? $"{department.Administrator.FirstMidName} {department.Administrator.LastName}"
                : null,
            CourseCount = department.Courses?.Count ?? 0,
            RowVersion = department.ConcurrencyToken
        };
    }

    /// <summary>
    /// Update Department entity from UpdateDepartmentDto
    /// </summary>
    public static void UpdateFromDto(this Department department, UpdateDepartmentDto dto)
    {
        department.Name = dto.Name;
        department.Budget = dto.Budget;
        department.StartDate = dto.StartDate;
        department.InstructorID = dto.InstructorID;
    }

    /// <summary>
    /// Convert CreateDepartmentDto to Department entity
    /// </summary>
    public static Department ToEntity(this CreateDepartmentDto dto)
    {
        return new Department
        {
            Name = dto.Name,
            Budget = dto.Budget,
            StartDate = dto.StartDate,
            InstructorID = dto.InstructorID
        };
    }
}
