using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Configuration;
using Wbs.Api.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/jira")]
public class JiraController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly JiraSyncService service;

    public JiraController(TelemetryClient telemetry, JiraSyncService service)
    {
        this.telemetry = telemetry;
        this.service = service;
    }

    /*[HttpPut("sync/customers")]
    public async Task<ActionResult> SyncCustomers()
    {
        try
        {
            var auth = Request.Headers.Authorization.FirstOrDefault();

            if (auth == null || auth != $"Token {config.LaunchToken}")
                return Unauthorized();

            await service.SyncCustomers();

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }*/
}

