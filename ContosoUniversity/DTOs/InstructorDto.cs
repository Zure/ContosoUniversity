#nullable enable
// T127-T131: Instructor DTOs and mappings
using System.ComponentModel.DataAnnotations;
using ContosoUniversity.Models;

namespace ContosoUniversity.DTOs;

/// <summary>
/// DTO for Instructor data transfer
/// </summary>
public class InstructorDto
{
    public int ID { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; } = string.Empty;

    public DateTime HireDate { get; set; }

    public string FullName => $"{LastName}, {FirstMidName}";

    public string? OfficeLocation { get; set; }

    public List<CourseAssignmentDto> CourseAssignments { get; set; } = new();
}

/// <summary>
/// DTO for course assignment information
/// </summary>
public class CourseAssignmentDto
{
    public int CourseID { get; set; }
    public int CourseNumber { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
}

/// <summary>
/// DTO for creating a new instructor
/// </summary>
public class CreateInstructorDto
{
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Last name must be between 1 and 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "First name must be between 1 and 50 characters")]
    public string FirstMidName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hire date is required")]
    public DateTime HireDate { get; set; }

    [StringLength(50)]
    public string? OfficeLocation { get; set; }

    public List<int> CourseIDs { get; set; } = new();
}

/// <summary>
/// DTO for updating an instructor
/// </summary>
public class UpdateInstructorDto
{
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Last name must be between 1 and 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "First name must be between 1 and 50 characters")]
    public string FirstMidName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hire date is required")]
    public DateTime HireDate { get; set; }

    [StringLength(50)]
    public string? OfficeLocation { get; set; }

    public List<int> CourseIDs { get; set; } = new();
}

/// <summary>
/// Extension methods for mapping between Instructor entity and DTOs
/// </summary>
public static class InstructorMappings
{
    /// <summary>
    /// Convert Instructor entity to InstructorDto
    /// </summary>
    public static InstructorDto ToDto(this Instructor instructor)
    {
        return new InstructorDto
        {
            ID = instructor.ID,
            LastName = instructor.LastName,
            FirstMidName = instructor.FirstMidName,
            HireDate = instructor.HireDate,
            OfficeLocation = instructor.OfficeAssignment?.Location,
            CourseAssignments = instructor.Courses?.Select(c => new CourseAssignmentDto
            {
                CourseID = c.CourseID,
                CourseNumber = c.CourseID,
                CourseTitle = c.Title,
                DepartmentName = c.Department?.Name ?? string.Empty
            }).ToList() ?? new List<CourseAssignmentDto>()
        };
    }

    /// <summary>
    /// Update Instructor entity from UpdateInstructorDto
    /// </summary>
    public static void UpdateFromDto(this Instructor instructor, UpdateInstructorDto dto)
    {
        instructor.LastName = dto.LastName;
        instructor.FirstMidName = dto.FirstMidName;
        instructor.HireDate = dto.HireDate;
    }

    /// <summary>
    /// Convert CreateInstructorDto to Instructor entity
    /// </summary>
    public static Instructor ToEntity(this CreateInstructorDto dto)
    {
        return new Instructor
        {
            LastName = dto.LastName,
            FirstMidName = dto.FirstMidName,
            HireDate = dto.HireDate,
            Courses = new List<Course>()
        };
    }
}
