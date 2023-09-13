using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Models;
using Wbs.Api.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<UsersController> logger;
    private readonly UserDataService dataService;

    public UsersController(TelemetryClient telemetry, ILogger<UsersController> logger, UserDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

    [Authorize]
    [HttpGet("{user}")]
    public async Task<IActionResult> GetUserAsync(string user)
    {
        try
        {
            return Ok(await dataService.GetUserAsync(user));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{user}/roles")]
    public async Task<ActionResult> GetUserSiteRolesAsync(string user)
    {
        try
        {
            return Ok(await dataService.GetRolesAsync(user));
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting user site roles");
            return StatusCode(500, e.Message);
        }
    }

    [Authorize]
    [HttpGet("{user}/memberships")]
    public async Task<IActionResult> GetUserMembershipsAsync(string user)
    {
        try
        {
            return Ok(await dataService.GetUserOrganizationsAsync(user));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{user}")]
    public async Task<IActionResult> PutUserAsync(string user, Member userObject)
    {
        try
        {
            if (userObject.Id != user)
                return BadRequest();

            await dataService.UpdateProfileAsync(userObject);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

