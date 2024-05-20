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
    private readonly ProjectResourceDataService projectResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;
    private readonly ResourceFileStorageService resourceService;

    public ProjectController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ProjectResourceDataService projectResourceDataService, ImportLibraryEntryService importLibraryEntryService, ResourceFileStorageService resourceService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ProjectController>();
        this.projectDataService = projectDataService;
        this.projectResourceDataService = projectResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
        this.resourceService = resourceService;
        this.db = db;
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
            if (project.owner != owner) return BadRequest("Owner in url must match owner in body");

            using (var conn = await db.CreateConnectionAsync())
                await projectDataService.SetAsync(conn, project);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting project {projectId} for owner {owner}", project.id, owner);
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
                return Ok((await projectDataService.GetByIdAsync(conn, projectId)).roles ?? new ProjectRole[] { });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting roles for project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}/resources")]
    public async Task<IActionResult> GetProjectResources(string owner, string projectId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await projectResourceDataService.GetListAsync(conn, projectId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting resources for project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{projectId}/export/libraryEntry")]
    public async Task<IActionResult> ExportProjectToLibraryEntry(string owner, string projectId, [FromBody] ProjectToLibraryOptions options)
    {
        try
        {
            return Ok(await importLibraryEntryService.ImportFromProjectAsync(owner, projectId, options));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting project {projectId} for owner {owner}", projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{projectId}/resources/{resourceId}")]
    public async Task<IActionResult> PutProjectResources(string owner, string projectId, string resourceId, ResourceRecord resource)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await projectResourceDataService.SetAsync(conn, owner, projectId, resource);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting resource {resourceId} for project {projectId} for owner {owner}", resourceId, projectId, owner);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{projectId}/resources/{resourceId}/file")]
    public async Task<IActionResult> GetResourceFileAsync(string owner, string projectId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                var record = await projectResourceDataService.GetAsync(conn, projectId, resourceId);
                var file = await resourceService.GetProjectResourceAsync(owner, projectId, resourceId);

                return File(file, "application/octet-stream", record.Resource);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{projectId}/resources/{resourceId}/file")]
    public async Task<IActionResult> PutResourceFileAsync(string owner, string projectId, string resourceId, IFormFile file)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                var record = await projectResourceDataService.GetAsync(conn, projectId, resourceId);
                var bytes = new byte[] { };

                using (var stream = file.OpenReadStream())
                {
                    bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, bytes.Length);
                }

                await resourceService.SaveProjectResourceAsync(owner, projectId, resourceId, bytes);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }
}

