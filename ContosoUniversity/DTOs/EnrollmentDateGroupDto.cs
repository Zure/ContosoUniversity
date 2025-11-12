#nullable enable
// T154: Enrollment statistics DTO
namespace ContosoUniversity.DTOs;

/// <summary>
/// Represents enrollment statistics grouped by enrollment date
/// </summary>
public class EnrollmentDateGroupDto
{
    /// <summary>
    /// The enrollment date
    /// </summary>
    public DateTime? EnrollmentDate { get; set; }

    /// <summary>
    /// Number of students enrolled on this date
    /// </summary>
    public int StudentCount { get; set; }
}
