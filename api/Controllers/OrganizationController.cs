using System.Security.Claims;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Models;
using Wbs.Api.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<OrganizationsController> logger;
    private readonly Auth0Service auth0Service;

    public OrganizationsController(TelemetryClient telemetry, ILogger<OrganizationsController> logger, Auth0Service auth0Service)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.auth0Service = auth0Service;
    }

    [Authorize]
    [HttpGet("{organization}/members")]
    public async Task<IActionResult> GetOrganizationalUsersAsync(string organization)
    {
        try
        {
            var users = await auth0Service.GetOrganizationalUsersAsync(organization);
            var members = new List<Member>();
            var roles = new List<IEnumerable<string>>();
            var gets = new List<Task<IEnumerable<string>>>();

            foreach (var user in users)
            {
                gets.Add(auth0Service.GetUserOrganizationalRolesAsync(organization, user.UserId));

                if (gets.Count == 10)
                {
                    roles.AddRange(await Task.WhenAll(gets));
                    gets.Clear();
                }
            }
            if (gets.Count > 0)
                roles.AddRange(await Task.WhenAll(gets));



            for (int i = 0; i < users.Count(); i++)
                members.Add(new Member
                {
                    Id = users.ElementAt(i).UserId,
                    Name = users.ElementAt(i).Name,
                    Email = users.ElementAt(i).Email,
                    Roles = roles.ElementAt(i)
                });

            return Ok(members);
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{organization}/members/{user}/roles")]
    public async Task<IActionResult> GetUserOrganizationalRolesAsync(string organization, string user)
    {
        try
        {
            return Ok(await auth0Service.GetUserOrganizationalRolesAsync(organization, user));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [IgnoreAntiforgeryToken(Order = 1000)]
    [HttpDelete("{organization}/members/{user}")]
    public async Task<IActionResult> RemoveUserFromOrganizationAsync(string organization, string user)
    {
        try
        {
            await auth0Service.RemoveUserFromOrganizationAsync(organization, user);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [IgnoreAntiforgeryToken(Order = 1000)]
    [HttpPut("{organization}/members/{user}/roles")]
    public async Task<IActionResult> AddUserOrganizationalRolesAsync(string organization, string user, [FromBody] IEnumerable<string> roles)
    {
        try
        {
            await auth0Service.AddUserOrganizationalRolesAsync(organization, user, roles);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organization}/members/{user}/roles")]
    [IgnoreAntiforgeryToken(Order = 1000)]
    public async Task<IActionResult> RemoveUserOrganizationalRolesAsync(string organization, string user, [FromBody] IEnumerable<string> roles)
    {
        try
        {
            await auth0Service.RemoveUserOrganizationalRolesAsync(organization, user, roles);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

