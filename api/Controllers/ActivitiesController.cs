using Microsoft.ApplicationInsights;
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

    public ActivitiesController(TelemetryClient telemetry, ILogger<ActivitiesController> logger, ActivityDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("child/{topLevel}/{child}/{skip}/{take}")]
    public async Task<IActionResult> GetForChildAsync(string topLevel, string child, int skip, int take)
    {
        try
        {
            return Ok(await dataService.GetForChildAsync(topLevel, child, skip, take));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Activity[] activities)
    {
        try
        {
            foreach (var activity in activities)
                await dataService.InsertAsync(activity);

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

