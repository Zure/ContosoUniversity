#nullable enable
// T109-T115: Departments API Controller
using Microsoft.AspNetCore.Mvc;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

/// <summary>
/// Controller for managing departments
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;
    private readonly ILogger<DepartmentsController> _logger;

    public DepartmentsController(
        IDepartmentService departmentService,
        ILogger<DepartmentsController> logger)
    {
        _departmentService = departmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all departments with optional search
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Items per page</param>
    /// <param name="searchString">Optional search by name</param>
    /// <returns>Paginated list of departments</returns>
    /// <response code="200">Returns the paginated list of departments</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponseDto<DepartmentDto>>> GetDepartments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchString = null)
    {
        _logger.LogInformation(
            "GET api/departments - Page: {PageNumber}, PageSize: {PageSize}, Search: {SearchString}",
            pageNumber, pageSize, searchString);

        var result = await _departmentService.GetDepartmentsAsync(
            pageNumber, pageSize, searchString);

        return Ok(result);
    }

    /// <summary>
    /// Get department by ID
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <returns>Department details</returns>
    /// <response code="200">Returns the department details</response>
    /// <response code="404">Department not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DepartmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        _logger.LogInformation("GET api/departments/{Id}", id);

        var department = await _departmentService.GetDepartmentByIdAsync(id);
        if (department == null)
        {
            return NotFound(new { message = $"Department with ID {id} not found" });
        }

        return Ok(department);
    }

    /// <summary>
    /// Create a new department
    /// </summary>
    /// <param name="dto">Department creation data</param>
    /// <returns>Created department</returns>
    /// <response code="201">Department created successfully</response>
    /// <response code="400">Invalid department data or administrator not found</response>
    [HttpPost]
    [ProducesResponseType(typeof(DepartmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentDto dto)
    {
        _logger.LogInformation("POST api/departments - Name: {Name}", dto.Name);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var department = await _departmentService.CreateDepartmentAsync(dto);
            return CreatedAtAction(
                nameof(GetDepartment),
                new { id = department.DepartmentID },
                department);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to create department: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update department
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <param name="dto">Updated department data</param>
    /// <returns>Updated department</returns>
    /// <response code="200">Department updated successfully</response>
    /// <response code="400">Invalid department data</response>
    /// <response code="404">Department not found</response>
    /// <response code="409">Concurrency conflict</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(DepartmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DepartmentDto>> UpdateDepartment(
        int id,
        [FromBody] UpdateDepartmentDto dto)
    {
        _logger.LogInformation("PUT api/departments/{Id}", id);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var department = await _departmentService.UpdateDepartmentAsync(id, dto);
            if (department == null)
            {
                return NotFound(new { message = $"Department with ID {id} not found" });
            }

            return Ok(department);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("modified by another user"))
        {
            _logger.LogWarning("Concurrency conflict updating department {Id}", id);
            return Conflict(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to update department: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete department
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <returns>No content on success</returns>
    /// <response code="204">Department deleted successfully</response>
    /// <response code="400">Cannot delete department with assigned courses</response>
    /// <response code="404">Department not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        _logger.LogInformation("DELETE api/departments/{Id}", id);

        try
        {
            var result = await _departmentService.DeleteDepartmentAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Department with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Failed to delete department {Id}: {Message}", id, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }
}
