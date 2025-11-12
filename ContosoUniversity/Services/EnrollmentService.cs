#nullable enable
// T082: Enrollment service implementation
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;

namespace ContosoUniversity.Services;

/// <summary>
/// Service for managing enrollment operations
/// </summary>
public class EnrollmentService : IEnrollmentService
{
    private readonly SchoolContext _context;
    private readonly ILogger<EnrollmentService> _logger;

    public EnrollmentService(SchoolContext context, ILogger<EnrollmentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<EnrollmentDto>> GetEnrollmentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        int? studentId = null,
        int? courseId = null)
    {
        _logger.LogInformation(
            "Getting enrollments - Page: {PageNumber}, PageSize: {PageSize}, StudentId: {StudentId}, CourseId: {CourseId}",
            pageNumber, pageSize, studentId, courseId);

        var query = _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .AsQueryable();

        // Apply filters
        if (studentId.HasValue)
        {
            query = query.Where(e => e.StudentID == studentId.Value);
        }

        if (courseId.HasValue)
        {
            query = query.Where(e => e.CourseID == courseId.Value);
        }

        var totalCount = await query.CountAsync();

        var enrollments = await query
            .OrderBy(e => e.Student.LastName)
            .ThenBy(e => e.Student.FirstMidName)
            .ThenBy(e => e.Course.Title)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(e => e.ToDto())
            .ToListAsync();

        return new PaginatedResponseDto<EnrollmentDto>
        {
            Data = enrollments,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<EnrollmentDto?> GetEnrollmentByIdAsync(int id)
    {
        _logger.LogInformation("Getting enrollment with ID: {EnrollmentId}", id);

        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.EnrollmentID == id);

        return enrollment?.ToDto();
    }

    public async Task<EnrollmentDto> CreateEnrollmentAsync(CreateEnrollmentDto dto)
    {
        _logger.LogInformation(
            "Creating enrollment - StudentId: {StudentId}, CourseId: {CourseId}",
            dto.StudentID, dto.CourseID);

        // Check if student exists
        var studentExists = await _context.Students.AnyAsync(s => s.ID == dto.StudentID);
        if (!studentExists)
        {
            throw new InvalidOperationException($"Student with ID {dto.StudentID} does not exist");
        }

        // Check if course exists
        var courseExists = await _context.Courses.AnyAsync(c => c.CourseID == dto.CourseID);
        if (!courseExists)
        {
            throw new InvalidOperationException($"Course with ID {dto.CourseID} does not exist");
        }

        // Check for duplicate enrollment
        var duplicateExists = await EnrollmentExistsAsync(dto.StudentID, dto.CourseID);
        if (duplicateExists)
        {
            throw new InvalidOperationException(
                $"Student is already enrolled in this course");
        }

        var enrollment = dto.ToEntity();
        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        await _context.Entry(enrollment)
            .Reference(e => e.Student)
            .LoadAsync();
        await _context.Entry(enrollment)
            .Reference(e => e.Course)
            .LoadAsync();

        _logger.LogInformation("Enrollment created with ID: {EnrollmentId}", enrollment.EnrollmentID);
        return enrollment.ToDto();
    }

    public async Task<EnrollmentDto?> UpdateEnrollmentAsync(int id, UpdateEnrollmentDto dto)
    {
        _logger.LogInformation("Updating enrollment with ID: {EnrollmentId}", id);

        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.EnrollmentID == id);

        if (enrollment == null)
        {
            _logger.LogWarning("Enrollment with ID {EnrollmentId} not found", id);
            return null;
        }

        enrollment.UpdateFromDto(dto);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Enrollment updated successfully: {EnrollmentId}", id);
        return enrollment.ToDto();
    }

    public async Task<bool> DeleteEnrollmentAsync(int id)
    {
        _logger.LogInformation("Deleting enrollment with ID: {EnrollmentId}", id);

        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null)
        {
            _logger.LogWarning("Enrollment with ID {EnrollmentId} not found", id);
            return false;
        }

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Enrollment deleted successfully: {EnrollmentId}", id);
        return true;
    }

    public async Task<bool> EnrollmentExistsAsync(int studentId, int courseId, int? excludeEnrollmentId = null)
    {
        var query = _context.Enrollments
            .Where(e => e.StudentID == studentId && e.CourseID == courseId);

        if (excludeEnrollmentId.HasValue)
        {
            query = query.Where(e => e.EnrollmentID != excludeEnrollmentId.Value);
        }

        return await query.AnyAsync();
    }
}
