using Auth0.Core.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger logger;
    private readonly UserDataService dataService;

    public UsersController(ILoggerFactory loggerFactory, UserDataService dataService)
    {
        logger = loggerFactory.CreateLogger<UsersController>();
        this.dataService = dataService;
    }

    [Authorize]
    [HttpGet("profile/{user}")]
    public async Task<IActionResult> GetUserAsync(string user)
    {
        try
        {
            return Ok(await dataService.GetUserAsync(user));
        }
        catch (ErrorApiException ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                return NotFound();

            logger.LogError(ex, "Error getting user");
            return new StatusCodeResult(500);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting user");
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
            logger.LogError(e, "Error getting user roles");
            return new StatusCodeResult(500);
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
            logger.LogError(ex, "Error getting user memberships");
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
            logger.LogError(ex, "Error updating user");
            return new StatusCodeResult(500);
        }
    }
}

