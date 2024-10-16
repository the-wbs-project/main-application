using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects")]
public class ProjectController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;
    private readonly ImportLibraryEntryService importService;

    public ProjectController(ILoggerFactory loggerFactory, DataServiceFactory data, ImportLibraryEntryService importService)
    {
        logger = loggerFactory.CreateLogger<ProjectController>();
        this.data = data;
        this.importService = importService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Projects.GetByOwnerAsync(conn, owner));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting projects for owner {owner}", owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Projects.GetByIdAsync(conn, projectId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{projectId}")]
    public async Task<IActionResult> Put(string owner, string projectId, Project project)
    {
        try
        {
            if (project.Owner != owner) return BadRequest("Owner in url must match owner in body");
            if (project.Id != projectId) return BadRequest("ProjectId in url must match projectId in body");

            using (var conn = await data.CreateConnectionAsync())
                await data.Projects.SetAsync(conn, project);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting project {projectId} for owner {owner}", project.Id, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{projectId}")]
    public async Task<IActionResult> Delete(string owner, string projectId)
    {
        try
        {

            using var conn = await data.CreateConnectionAsync();

            var project = await data.Projects.GetByIdAsync(conn, projectId);

            if (project == null) return NotFound();

            project.Status = "cancelled";

            await data.Projects.SetAsync(conn, project);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error cancelling project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}/roles")]
    public async Task<IActionResult> GetRolesByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok((await data.Projects.GetByIdAsync(conn, projectId)).Roles ?? new UserRole[] { });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting roles for project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{projectId}/export/libraryEntry")]
    public async Task<IActionResult> ExportProjectToLibraryEntry(string owner, string projectId, [FromBody] ProjectToLibraryOptions options)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                var newId = await importService.ImportFromProjectAsync(conn, owner, projectId, options);

                return Ok(newId);
            }

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{projectId}/snapshot")]
    public async Task<IActionResult> SnapshotProject(string owner, string projectId, [FromBody] string activityId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                await data.ProjectSnapshots.SetAsync(conn, projectId, [activityId]);

                return NoContent();
            }

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }
}

