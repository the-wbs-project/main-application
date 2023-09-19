using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChecklistsController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ChecklistsController> logger;
    private readonly ChecklistDataService dataService;

    public ChecklistsController(TelemetryClient telemetry, ILogger<ChecklistsController> logger, ChecklistDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync()
    {
        try
        {
            return Ok(await dataService.GetAsync());
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ChecklistGroup[] groups)
    {
        try
        {
            await dataService.SetAsync(groups);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}
