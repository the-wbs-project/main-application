using Microsoft.ApplicationInsights;
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
    private readonly ILogger<ProjectController> logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectResourceDataService projectResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;

    public ProjectController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ProjectResourceDataService projectResourceDataService, ImportLibraryEntryService importLibraryEntryService)
    {
        logger = loggerFactory.CreateLogger<ProjectController>();
        this.projectDataService = projectDataService;
        this.projectResourceDataService = projectResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            return Ok(await projectDataService.GetByOwnerAsync(owner));
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

            await projectDataService.SetAsync(project);

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
            return Ok(await projectDataService.GetByIdAsync(projectId));
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
            return Ok((await projectDataService.GetByIdAsync(projectId)).roles ?? new ProjectRole[] { });
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
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

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
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

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
}

