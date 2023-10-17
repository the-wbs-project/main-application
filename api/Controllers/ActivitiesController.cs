using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ActivitiesController> logger;
    private readonly ActivityDataService dataService;
    private readonly ProjectSnapshotDataService snapshotDataService;

    public ActivitiesController(TelemetryClient telemetry, ILogger<ActivitiesController> logger, ActivityDataService dataService, ProjectSnapshotDataService snapshotDataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
        this.snapshotDataService = snapshotDataService;
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/count")]
    public async Task<IActionResult> GetCountForTopLevelAsync(string topLevel)
    {
        try
        {
            return Ok(await dataService.GetCountForTopLevelAsync(topLevel));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/{skip}/{take}")]
    public async Task<IActionResult> GetForTopLevelAsync(string topLevel, int skip, int take)
    {
        try
        {
            return Ok(await dataService.GetForTopLevelAsync(topLevel, skip, take));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/child/{child}/count")]
    public async Task<IActionResult> GetForChildAsync(string topLevel, string child)
    {
        try
        {
            return Ok(await dataService.GetCountForChildAsync(topLevel, child));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/child/{child}/{skip}/{take}")]
    public async Task<IActionResult> GetForChildAsync(string topLevel, string child, int skip, int take)
    {
        try
        {
            return Ok(await dataService.GetForChildAsync(topLevel, child, skip, take));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Put(Activity[] activities)
    {
        try
        {
            using (var conn = dataService.CreateConnection())
            {
                await conn.OpenAsync();

                foreach (var data in activities)
                    await dataService.InsertAsync(conn, data);

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
    [HttpPut("projects")]
    public async Task<IActionResult> PutProjects(ProjectActivityRecord[] activities)
    {
        try
        {
            using (var conn = dataService.CreateConnection())
            {
                await conn.OpenAsync();

                foreach (var data in activities)
                {
                    await dataService.InsertAsync(conn, data.activity);
                    await snapshotDataService.SetAsync(conn, data.activity.id, data.project, data.nodes);
                }

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

