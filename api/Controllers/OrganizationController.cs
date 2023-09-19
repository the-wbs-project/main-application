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
    private readonly OrganizationDataService dataService;
    private readonly InviteDataService inviteDataService;

    public OrganizationsController(TelemetryClient telemetry, ILogger<OrganizationsController> logger, OrganizationDataService dataService, InviteDataService inviteDataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
        this.inviteDataService = inviteDataService;
    }

    [Authorize]
    [HttpGet("{organization}/members")]
    public async Task<IActionResult> GetOrganizationalUsersAsync(string organization)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            var users = new List<Member>(await dataService.GetOrganizationalUsersAsync(orgId));
            var roles = new List<IEnumerable<string>>();
            var gets = new List<Task<IEnumerable<string>>>();

            foreach (var user in users)
            {
                gets.Add(dataService.GetUserOrganizationalRolesAsync(orgId, user.Id));

                if (gets.Count == 10)
                {
                    roles.AddRange(await Task.WhenAll(gets));
                    gets.Clear();
                }
            }
            if (gets.Count > 0)
                roles.AddRange(await Task.WhenAll(gets));

            for (int i = 0; i < users.Count(); i++)
                users[i].Roles = roles.ElementAt(i).ToList();

            return Ok(users);
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{organization}/members/{user}/roles")]
    public async Task<IActionResult> GetUserOrganizationalRolesAsync(string organization, string user)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            return Ok(await dataService.GetUserOrganizationalRolesAsync(orgId, user));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organization}/members/{user}")]
    public async Task<IActionResult> RemoveUserFromOrganizationAsync(string organization, string user)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            await dataService.RemoveUserFromOrganizationAsync(orgId, user);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{organization}/members/{user}/roles")]
    public async Task<IActionResult> AddUserOrganizationalRolesAsync(string organization, string user, [FromBody] List<string> roles)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            await dataService.AddUserOrganizationalRolesAsync(orgId, user, roles);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organization}/members/{user}/roles")]
    public async Task<IActionResult> RemoveUserOrganizationalRolesAsync(string organization, string user, [FromBody] List<string> roles)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            await dataService.RemoveUserOrganizationalRolesAsync(orgId, user, roles);

            return Ok();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{organization}/invites")]
    public async Task<IActionResult> GetAllInvitesAsync(string organization)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            return Ok(await inviteDataService.GetAllAsync(orgId));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{organization}/invites")]
    public async Task<IActionResult> SendInviteAsync(string organization, [FromBody] InviteBody invite)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            return Ok(await inviteDataService.SendAsync(orgId, invite));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organization}/invites/{inviteId}")]
    public async Task<IActionResult> CancelInviteAsync(string organization, string inviteId)
    {
        try
        {
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            await inviteDataService.CancelAsync(orgId, inviteId);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

