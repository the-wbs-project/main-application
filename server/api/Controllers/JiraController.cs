using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Configuration;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/jira")]
public class JiraController : ControllerBase
{


    /*  private readonly JiraSyncService service;

    public JiraController(TelemetryClient telemetry, JiraSyncService service, DbService db)
    {
        this.telemetry = telemetry;
        this.service = service;
        this.db = db;
    }
[HttpPut("sync/customers")]
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

