// T084-T090: Enrollments API Controller
using Microsoft.AspNetCore.Mvc;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

/// <summary>
/// Controller for managing student enrollments in courses
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<EnrollmentsController> _logger;

    public EnrollmentsController(
        IEnrollmentService enrollmentService,
        ILogger<EnrollmentsController> logger)
    {
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all enrollments with optional filtering
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <param name="studentId">Optional student ID filter</param>
    /// <param name="courseId">Optional course ID filter</param>
    /// <returns>Paginated list of enrollments</returns>
    /// <response code="200">Returns the paginated list of enrollments</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<EnrollmentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponseDto<EnrollmentDto>>> GetEnrollments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? studentId = null,
        [FromQuery] int? courseId = null)
    {
        _logger.LogInformation(
            "GET api/enrollments - Page: {PageNumber}, PageSize: {PageSize}, StudentId: {StudentId}, CourseId: {CourseId}",
            pageNumber, pageSize, studentId, courseId);

        var result = await _enrollmentService.GetEnrollmentsAsync(
            pageNumber, pageSize, studentId, courseId);

        return Ok(result);
    }

    /// <summary>
    /// Get enrollment by ID
    /// </summary>
    /// <param name="id">Enrollment ID</param>
    /// <returns>Enrollment details</returns>
    /// <response code="200">Returns the enrollment details</response>
    /// <response code="404">Enrollment not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EnrollmentDto>> GetEnrollment(int id)
    {
        _logger.LogInformation("GET api/enrollments/{Id}", id);

        var enrollment = await _enrollmentService.GetEnrollmentByIdAsync(id);
        if (enrollment == null)
        {
            return NotFound(new { message = $"Enrollment with ID {id} not found" });
        }

        return Ok(enrollment);
    }

    /// <summary>
    /// Create a new enrollment
    /// </summary>
    /// <param name="dto">Enrollment creation data</param>
    /// <returns>Created enrollment</returns>
    /// <response code="201">Enrollment created successfully</response>
    /// <response code="400">Invalid enrollment data</response>
    /// <response code="409">Student already enrolled in this course</response>
    [HttpPost]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<EnrollmentDto>> CreateEnrollment([FromBody] CreateEnrollmentDto dto)
    {
        _logger.LogInformation(
            "POST api/enrollments - StudentId: {StudentId}, CourseId: {CourseId}",
            dto.StudentID, dto.CourseID);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var enrollment = await _enrollmentService.CreateEnrollmentAsync(dto);
            return CreatedAtAction(
                nameof(GetEnrollment),
                new { id = enrollment.EnrollmentID },
                enrollment);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to create enrollment: {Message}", ex.Message);

            // Return 409 Conflict for duplicate enrollments
            if (ex.Message.Contains("already enrolled"))
            {
                return Conflict(new { message = ex.Message });
            }

            // Return 400 Bad Request for other validation errors (student/course not found)
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update enrollment (primarily for grade updates)
    /// </summary>
    /// <param name="id">Enrollment ID</param>
    /// <param name="dto">Updated enrollment data</param>
    /// <returns>Updated enrollment</returns>
    /// <response code="200">Enrollment updated successfully</response>
    /// <response code="400">Invalid enrollment data</response>
    /// <response code="404">Enrollment not found</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EnrollmentDto>> UpdateEnrollment(
        int id,
        [FromBody] UpdateEnrollmentDto dto)
    {
        _logger.LogInformation("PUT api/enrollments/{Id}", id);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var enrollment = await _enrollmentService.UpdateEnrollmentAsync(id, dto);
        if (enrollment == null)
        {
            return NotFound(new { message = $"Enrollment with ID {id} not found" });
        }

        return Ok(enrollment);
    }

    /// <summary>
    /// Delete enrollment
    /// </summary>
    /// <param name="id">Enrollment ID</param>
    /// <returns>No content on success</returns>
    /// <response code="204">Enrollment deleted successfully</response>
    /// <response code="404">Enrollment not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        _logger.LogInformation("DELETE api/enrollments/{Id}", id);

        var result = await _enrollmentService.DeleteEnrollmentAsync(id);
        if (!result)
        {
            return NotFound(new { message = $"Enrollment with ID {id} not found" });
        }

        return NoContent();
    }
}
