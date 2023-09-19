using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ListsController> logger;
    private readonly ListDataService dataService;

    public ListsController(TelemetryClient telemetry, ILogger<ListsController> logger, ListDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            return Ok(await dataService.GetAsync(type));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ListItem resource)
    {
        try
        {
            await dataService.SetAsync(resource);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [HttpDelete("{type}/{id}")]
    public async Task<IActionResult> Delete(string type, string id)
    {
        try
        {
            await dataService.DeleteAsync(type, id);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

