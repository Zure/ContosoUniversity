#nullable enable
// T155-T157: Statistics API Controller
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Controllers;

/// <summary>
/// Controller for enrollment statistics and analytics
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly SchoolContext _context;
    private readonly ILogger<StatisticsController> _logger;

    public StatisticsController(
        SchoolContext context,
        ILogger<StatisticsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get enrollment statistics grouped by enrollment date
    /// </summary>
    /// <returns>List of enrollment counts per date</returns>
    /// <response code="200">Returns the enrollment statistics</response>
    [HttpGet("enrollment-by-date")]
    [ProducesResponseType(typeof(IEnumerable<EnrollmentDateGroupDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EnrollmentDateGroupDto>>> GetEnrollmentByDate()
    {
        _logger.LogInformation("GET api/statistics/enrollment-by-date");

        var data = await _context.Students
            .GroupBy(s => s.EnrollmentDate)
            .Select(g => new EnrollmentDateGroupDto
            {
                EnrollmentDate = g.Key,
                StudentCount = g.Count()
            })
            .OrderBy(x => x.EnrollmentDate)
            .ToListAsync();

        return Ok(data);
    }
}
