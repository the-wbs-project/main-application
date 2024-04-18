using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.Models;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<RolesController> logger;
    private readonly UserDataService dataService;

    public RolesController(TelemetryClient telemetry, ILogger<RolesController> logger, UserDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetRolesAsync()
    {
        try
        {
            return Ok(await dataService.GetRolesAsync());
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

