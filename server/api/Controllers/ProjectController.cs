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
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ProjectDataService projectDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;
    private readonly ProjectSnapshotDataService projectSnapshotDataService;

    public ProjectController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ImportLibraryEntryService importLibraryEntryService, ProjectSnapshotDataService projectSnapshotDataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ProjectController>();
        this.projectDataService = projectDataService;
        this.importLibraryEntryService = importLibraryEntryService;
        this.db = db;
        this.projectSnapshotDataService = projectSnapshotDataService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await projectDataService.GetByOwnerAsync(conn, owner));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting projects for owner {owner}", owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{projectId}")]
    public async Task<IActionResult> Put(string owner, Project project)
    {
        try
        {
            if (project.Owner != owner) return BadRequest("Owner in url must match owner in body");

            using (var conn = await db.CreateConnectionAsync())
                await projectDataService.SetAsync(conn, project);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting project {projectId} for owner {owner}", project.Id, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await projectDataService.GetByIdAsync(conn, projectId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}/roles")]
    public async Task<IActionResult> GetRolesByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok((await projectDataService.GetByIdAsync(conn, projectId)).Roles ?? new ProjectRole[] { });
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
            using (var conn = await db.CreateConnectionAsync())
            {
                var newId = await importLibraryEntryService.ImportFromProjectAsync(conn, owner, projectId, options);

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
            using (var conn = await db.CreateConnectionAsync())
            {
                await projectSnapshotDataService.SetAsync(conn, projectId, [activityId]);

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

