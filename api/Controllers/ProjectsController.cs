using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ProjectsController> logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService nodeDataService;

    public ProjectsController(ILogger<ProjectsController> logger, TelemetryClient telemetry, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.nodeDataService = nodeDataService;
        this.projectDataService = projectDataService;
    }

    [Authorize]
    [HttpGet("owner/{owner}")]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            return Ok(await projectDataService.GetByOwnerAsync(owner));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}")]
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
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string id)
    {
        try
        {
            return Ok(await projectDataService.GetByIdAsync(id));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> GetNodesByIdAsync(string owner, string id)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await nodeDataService.GetByProjectAsync(conn, id));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> PutNode(string owner, string id, ProjectNodeSaveRecord record)
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
                if (upsert.projectId != id)
                    return BadRequest("All records must have same project id as provided in url");
            }

            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, id, record);

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

