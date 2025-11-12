#nullable enable
// T107: Department service implementation
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;

namespace ContosoUniversity.Services;

/// <summary>
/// Service for managing department operations
/// </summary>
public class DepartmentService : IDepartmentService
{
    private readonly SchoolContext _context;
    private readonly ILogger<DepartmentService> _logger;

    public DepartmentService(SchoolContext context, ILogger<DepartmentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<DepartmentDto>> GetDepartmentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null)
    {
        _logger.LogInformation(
            "Getting departments - Page: {PageNumber}, PageSize: {PageSize}, Search: {SearchString}",
            pageNumber, pageSize, searchString);

        var query = _context.Departments
            .Include(d => d.Administrator)
            .Include(d => d.Courses)
            .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(searchString))
        {
            query = query.Where(d => d.Name.Contains(searchString));
        }

        var totalCount = await query.CountAsync();

        var departments = await query
            .OrderBy(d => d.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(d => d.ToDto())
            .ToListAsync();

        return new PaginatedResponseDto<DepartmentDto>
        {
            Data = departments,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<DepartmentDto?> GetDepartmentByIdAsync(int id)
    {
        _logger.LogInformation("Getting department with ID: {DepartmentId}", id);

        var department = await _context.Departments
            .Include(d => d.Administrator)
            .Include(d => d.Courses)
            .FirstOrDefaultAsync(d => d.DepartmentID == id);

        return department?.ToDto();
    }

    public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto)
    {
        _logger.LogInformation("Creating department: {Name}", dto.Name);

        // Validate administrator exists if provided
        if (dto.InstructorID.HasValue)
        {
            var instructorExists = await _context.Instructors
                .AnyAsync(i => i.ID == dto.InstructorID.Value);
            if (!instructorExists)
            {
                throw new InvalidOperationException(
                    $"Instructor with ID {dto.InstructorID.Value} does not exist");
            }
        }

        var department = dto.ToEntity();
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        await _context.Entry(department)
            .Reference(d => d.Administrator)
            .LoadAsync();
        await _context.Entry(department)
            .Collection(d => d.Courses)
            .LoadAsync();

        _logger.LogInformation("Department created with ID: {DepartmentId}", department.DepartmentID);
        return department.ToDto();
    }

    public async Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto)
    {
        _logger.LogInformation("Updating department with ID: {DepartmentId}", id);

        var department = await _context.Departments
            .Include(d => d.Administrator)
            .Include(d => d.Courses)
            .FirstOrDefaultAsync(d => d.DepartmentID == id);

        if (department == null)
        {
            _logger.LogWarning("Department with ID {DepartmentId} not found", id);
            return null;
        }

        // Validate administrator exists if provided
        if (dto.InstructorID.HasValue)
        {
            var instructorExists = await _context.Instructors
                .AnyAsync(i => i.ID == dto.InstructorID.Value);
            if (!instructorExists)
            {
                throw new InvalidOperationException(
                    $"Instructor with ID {dto.InstructorID.Value} does not exist");
            }
        }

        // Set the original concurrency token for optimistic concurrency check
        if (dto.RowVersion != null)
        {
            _context.Entry(department).Property(nameof(Department.ConcurrencyToken))
                .OriginalValue = dto.RowVersion;
        }

        department.UpdateFromDto(dto);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Department updated successfully: {DepartmentId}", id);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogWarning("Concurrency conflict updating department {DepartmentId}", id);
            throw new InvalidOperationException(
                "The department was modified by another user. Please refresh and try again.", ex);
        }

        return department.ToDto();
    }

    public async Task<bool> DeleteDepartmentAsync(int id)
    {
        _logger.LogInformation("Deleting department with ID: {DepartmentId}", id);

        var department = await _context.Departments
            .Include(d => d.Courses)
            .FirstOrDefaultAsync(d => d.DepartmentID == id);

        if (department == null)
        {
            _logger.LogWarning("Department with ID {DepartmentId} not found", id);
            return false;
        }

        // Check if department has courses
        if (department.Courses.Any())
        {
            throw new InvalidOperationException(
                $"Cannot delete department. It has {department.Courses.Count} course(s) assigned.");
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Department deleted successfully: {DepartmentId}", id);
        return true;
    }

    public async Task<bool> CanDeleteDepartmentAsync(int id)
    {
        var courseCount = await _context.Courses
            .CountAsync(c => c.DepartmentID == id);

        return courseCount == 0;
    }
}
