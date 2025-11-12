#nullable enable
// T135-T141: Instructors API Controller
using Microsoft.AspNetCore.Mvc;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

/// <summary>
/// Controller for managing instructors
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InstructorsController : ControllerBase
{
    private readonly IInstructorService _instructorService;
    private readonly ILogger<InstructorsController> _logger;

    public InstructorsController(
        IInstructorService instructorService,
        ILogger<InstructorsController> logger)
    {
        _instructorService = instructorService;
        _logger = logger;
    }

    /// <summary>
    /// Get all instructors with optional search
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <param name="searchString">Optional search by name</param>
    /// <returns>Paginated list of instructors</returns>
    /// <response code="200">Returns the paginated list of instructors</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<InstructorDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponseDto<InstructorDto>>> GetInstructors(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchString = null)
    {
        _logger.LogInformation(
            "GET api/instructors - Page: {PageNumber}, PageSize: {PageSize}, Search: {SearchString}",
            pageNumber, pageSize, searchString);

        var result = await _instructorService.GetInstructorsAsync(
            pageNumber, pageSize, searchString);

        return Ok(result);
    }

    /// <summary>
    /// Get instructor by ID with course assignments
    /// </summary>
    /// <param name="id">Instructor ID</param>
    /// <returns>Instructor details with courses</returns>
    /// <response code="200">Returns the instructor details</response>
    /// <response code="404">Instructor not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InstructorDto>> GetInstructor(int id)
    {
        _logger.LogInformation("GET api/instructors/{Id}", id);

        var instructor = await _instructorService.GetInstructorByIdAsync(id);
        if (instructor == null)
        {
            return NotFound(new { message = $"Instructor with ID {id} not found" });
        }

        return Ok(instructor);
    }

    /// <summary>
    /// Create a new instructor
    /// </summary>
    /// <param name="dto">Instructor creation data with optional office assignment</param>
    /// <returns>Created instructor</returns>
    /// <response code="201">Instructor created successfully</response>
    /// <response code="400">Invalid instructor data</response>
    [HttpPost]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InstructorDto>> CreateInstructor([FromBody] CreateInstructorDto dto)
    {
        _logger.LogInformation("POST api/instructors - Name: {LastName}, {FirstName}",
            dto.LastName, dto.FirstMidName);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var instructor = await _instructorService.CreateInstructorAsync(dto);
            return CreatedAtAction(
                nameof(GetInstructor),
                new { id = instructor.ID },
                instructor);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to create instructor: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update instructor
    /// </summary>
    /// <param name="id">Instructor ID</param>
    /// <param name="dto">Updated instructor data</param>
    /// <returns>Updated instructor</returns>
    /// <response code="200">Instructor updated successfully</response>
    /// <response code="400">Invalid instructor data</response>
    /// <response code="404">Instructor not found</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(InstructorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InstructorDto>> UpdateInstructor(
        int id,
        [FromBody] UpdateInstructorDto dto)
    {
        _logger.LogInformation("PUT api/instructors/{Id}", id);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var instructor = await _instructorService.UpdateInstructorAsync(id, dto);
            if (instructor == null)
            {
                return NotFound(new { message = $"Instructor with ID {id} not found" });
            }

            return Ok(instructor);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to update instructor: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete instructor
    /// </summary>
    /// <param name="id">Instructor ID</param>
    /// <returns>No content on success</returns>
    /// <response code="204">Instructor deleted successfully</response>
    /// <response code="400">Cannot delete instructor who is a department administrator</response>
    /// <response code="404">Instructor not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteInstructor(int id)
    {
        _logger.LogInformation("DELETE api/instructors/{Id}", id);

        try
        {
            var result = await _instructorService.DeleteInstructorAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Instructor with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to delete instructor {Id}: {Message}", id, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }
}
