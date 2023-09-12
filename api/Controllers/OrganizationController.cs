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

            var users = await dataService.GetOrganizationalUsersAsync(orgId);
            var members = new List<Member>();
            var roles = new List<IEnumerable<string>>();
            var gets = new List<Task<IEnumerable<string>>>();

            foreach (var user in users)
            {
                gets.Add(dataService.GetUserOrganizationalRolesAsync(orgId, user.UserId));

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
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            return Ok(await dataService.GetUserOrganizationalRolesAsync(orgId, user));
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
            var orgId = await dataService.GetOrganizationIdByNameAsync(organization);

            await dataService.RemoveUserFromOrganizationAsync(orgId, user);

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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organization}/members/{user}/roles")]
    [IgnoreAntiforgeryToken(Order = 1000)]
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
            logger.LogError(ex.ToString());
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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{organization}/invites")]
    [IgnoreAntiforgeryToken(Order = 1000)]
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
            logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

