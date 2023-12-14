using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;
using Wbs.Api.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects/{projectId}/nodes")]
public class ProjectNodeController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ProjectNodeController> logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService nodeDataService;
    private readonly ProjectNodeResourceDataService nodeResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;

    public ProjectNodeController(ILogger<ProjectNodeController> logger, TelemetryClient telemetry, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService, ProjectNodeResourceDataService nodeResourceDataService, ImportLibraryEntryService importLibraryEntryService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.nodeDataService = nodeDataService;
        this.projectDataService = projectDataService;
        this.nodeResourceDataService = nodeResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetNodesByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await nodeDataService.GetByProjectAsync(conn, projectId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> PutNode(string owner, string projectId, BulkSaveRecord<ProjectNode> record)
    {
        try
        {
            if (record.upserts == null) record.upserts = new ProjectNode[] { };
            if (record.removeIds == null) record.removeIds = new string[] { };
            //
            //  Make sure all records have same project id as provided above
            //
            foreach (var upsert in record.upserts)
            {
                if (upsert.projectId != projectId)
                    return BadRequest("All records must have same project id as provided in url");
            }

            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, projectId, record);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }


    [Authorize]
    [HttpGet("{nodeId}/resources")]
    public async Task<IActionResult> GetTaskResources(string owner, string projectId, string nodeId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                return Ok(await nodeResourceDataService.GetListAsync(conn, projectId, nodeId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{nodeId}/export/libraryEntry")]
    public async Task<IActionResult> ExportProjectNodeToLibraryEntry(string owner, string projectId, string nodeId, [FromBody] ProjectNodeToLibraryOptions options)
    {
        try
        {
            return Ok(await importLibraryEntryService.ImportFromProjectNodeAsync(owner, projectId, nodeId, options));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutTaskResources(string owner, string projectId, string nodeId, string resourceId, ResourceRecord resource)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                await nodeResourceDataService.SetAsync(conn, owner, projectId, nodeId, resource);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

