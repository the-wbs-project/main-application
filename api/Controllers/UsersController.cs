using Auth0.ManagementApi.Models;
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
    private readonly Auth0Service auth0Service;

    public UsersController(TelemetryClient telemetry, ILogger<UsersController> logger, Auth0Service auth0Service)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.auth0Service = auth0Service;
    }

    [Authorize]
    [HttpGet("{user}")]
    public async Task<IActionResult> GetUserAsync(string user)
    {
        try
        {
            var obj = await auth0Service.GetUserAsync(user);

            return Ok(new UserLite
            {
                Id = obj.UserId,
                Name = obj.FullName,
                Email = obj.Email
            });
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
            var roles = await auth0Service.GetUserSiteRolesAsync(user);

            return Ok(roles);
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
            return Ok(await auth0Service.GetUserOrganizationsAsync(user));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

