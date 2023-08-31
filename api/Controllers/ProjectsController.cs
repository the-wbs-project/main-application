using com.sun.tools.@internal.jxc.ap;
using Microsoft.ApplicationInsights;
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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpPut("owner/{owner}")]
    public async Task<IActionResult> Put(string owner, Project project)
    {
        try
        {
            await projectDataService.SetAsync(project);

            return Accepted();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> GetNodesByIdAsync(string owner, string id)
    {
        try
        {
            if (!await projectDataService.VerifyProjectAsync(owner, id))
                return BadRequest("Project not found for the owner provided.");

            return Ok(await nodeDataService.GetByProjectAsync(id));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpPut("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> PutNode(string owner, string id, ProjectNodeSaveRecord record)
    {
        try
        {
            if (!await projectDataService.VerifyProjectAsync(owner, id))
                return BadRequest("Project not found for the owner provided.");

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

            await nodeDataService.SetSaveRecordAsync(owner, id, record);

            return Accepted();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

