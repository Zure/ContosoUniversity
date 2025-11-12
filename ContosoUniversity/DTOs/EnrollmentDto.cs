#nullable enable
// T077-T080: Enrollment DTOs and mappings
using System.ComponentModel.DataAnnotations;
using ContosoUniversity.Models;

namespace ContosoUniversity.DTOs;

/// <summary>
/// DTO for Enrollment data transfer
/// </summary>
public class EnrollmentDto
{
    public int EnrollmentID { get; set; }
    public int CourseID { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public int StudentID { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string? Grade { get; set; }
}

/// <summary>
/// DTO for creating a new enrollment
/// </summary>
public class CreateEnrollmentDto
{
    [Required(ErrorMessage = "CourseID is required")]
    public int CourseID { get; set; }

    [Required(ErrorMessage = "StudentID is required")]
    public int StudentID { get; set; }

    [RegularExpression("^[A-F]$", ErrorMessage = "Grade must be A, B, C, D, or F")]
    public string? Grade { get; set; }
}

/// <summary>
/// DTO for updating an enrollment (primarily for grade updates)
/// </summary>
public class UpdateEnrollmentDto
{
    [RegularExpression("^[A-F]$", ErrorMessage = "Grade must be A, B, C, D, or F")]
    public string? Grade { get; set; }
}

/// <summary>
/// Extension methods for mapping between Enrollment entity and DTOs
/// </summary>
public static class EnrollmentMappings
{
    /// <summary>
    /// Convert Enrollment entity to EnrollmentDto
    /// </summary>
    public static EnrollmentDto ToDto(this Enrollment enrollment)
    {
        return new EnrollmentDto
        {
            EnrollmentID = enrollment.EnrollmentID,
            CourseID = enrollment.CourseID,
            CourseTitle = enrollment.Course?.Title ?? string.Empty,
            StudentID = enrollment.StudentID,
            StudentName = enrollment.Student != null
                ? $"{enrollment.Student.FirstMidName} {enrollment.Student.LastName}"
                : string.Empty,
            Grade = enrollment.Grade?.ToString()
        };
    }

    /// <summary>
    /// Update Enrollment entity from UpdateEnrollmentDto
    /// </summary>
    public static void UpdateFromDto(this Enrollment enrollment, UpdateEnrollmentDto dto)
    {
        if (dto.Grade != null)
        {
            enrollment.Grade = Enum.TryParse<Grade>(dto.Grade, out var grade) ? grade : null;
        }
        else
        {
            enrollment.Grade = null;
        }
    }

    /// <summary>
    /// Convert CreateEnrollmentDto to Enrollment entity
    /// </summary>
    public static Enrollment ToEntity(this CreateEnrollmentDto dto)
    {
        return new Enrollment
        {
            CourseID = dto.CourseID,
            StudentID = dto.StudentID,
            Grade = dto.Grade != null && Enum.TryParse<Grade>(dto.Grade, out var grade) ? grade : null
        };
    }
}
