// T059-T065: Courses API Controller with CRUD operations
#nullable enable
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;
using Microsoft.AspNetCore.Mvc;

namespace ContosoUniversity.Controllers;

/// <summary>
/// API controller for managing courses
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly ILogger<CoursesController> _logger;

    public CoursesController(
        ICourseService courseService,
        ILogger<CoursesController> logger)
    {
        _courseService = courseService;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of courses with optional filtering
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="departmentId">Optional department ID filter</param>
    /// <param name="searchString">Optional search string for filtering by title</param>
    /// <returns>Paginated list of courses</returns>
    /// <response code="200">Returns the paginated list of courses</response>
    /// <response code="400">If the pagination parameters are invalid</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<CourseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedResponseDto<CourseDto>>> GetCourses(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? departmentId = null,
        [FromQuery] string? searchString = null)
    {
        if (pageNumber < 1)
        {
            return BadRequest("Page number must be greater than 0");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("Page size must be between 1 and 100");
        }

        var result = await _courseService.GetCoursesAsync(
            pageNumber, pageSize, departmentId, searchString);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific course by ID
    /// </summary>
    /// <param name="id">The course ID</param>
    /// <returns>The course details</returns>
    /// <response code="200">Returns the course</response>
    /// <response code="404">If the course is not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);

        if (course == null)
        {
            _logger.LogWarning("Course {CourseId} not found", id);
            return NotFound(new { message = $"Course with ID {id} not found" });
        }

        return Ok(course);
    }

    /// <summary>
    /// Create a new course
    /// </summary>
    /// <param name="createDto">Course data</param>
    /// <returns>The created course</returns>
    /// <response code="201">Returns the newly created course</response>
    /// <response code="400">If the course data is invalid or course number already exists</response>
    /// <response code="404">If the specified department does not exist</response>
    [HttpPost]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CreateCourseDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var course = await _courseService.CreateCourseAsync(createDto);

            return CreatedAtAction(
                nameof(GetCourse),
                new { id = course.CourseId },
                course);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to create course");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Department not found");
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing course
    /// </summary>
    /// <param name="id">The course ID</param>
    /// <param name="updateDto">Updated course data</param>
    /// <returns>The updated course</returns>
    /// <response code="200">Returns the updated course</response>
    /// <response code="400">If the course data is invalid</response>
    /// <response code="404">If the course or department is not found</response>
    /// <response code="409">If there is a concurrency conflict</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CourseDto>> UpdateCourse(
        int id,
        [FromBody] UpdateCourseDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var course = await _courseService.UpdateCourseAsync(id, updateDto);
            return Ok(course);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Course or Department not found");
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a course
    /// </summary>
    /// <param name="id">The course ID</param>
    /// <returns>No content on success</returns>
    /// <response code="204">If the course was successfully deleted</response>
    /// <response code="404">If the course is not found</response>
    /// <response code="400">If the course has enrollments and cannot be deleted</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        try
        {
            var deleted = await _courseService.DeleteCourseAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Course {CourseId} not found for deletion", id);
                return NotFound(new { message = $"Course with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot delete course {CourseId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
}
