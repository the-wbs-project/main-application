using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.AuthApi.Services;

namespace Wbs.AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{

    private readonly ILogger<OrganizationsController> _logger;
    private readonly Auth0Service _auth0Service;

    public OrganizationsController(ILogger<OrganizationsController> logger, Auth0Service auth0Service)
    {
        _logger = logger;
        _auth0Service = auth0Service;
    }

    [Authorize]
    [HttpGet("{organization}/members")]
    public async Task<IEnumerable<Member>> GetOrganizationalUsersAsync(string organization)
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;

        //_logger.LogWarning(identity.Actor.Name);

        var users = await _auth0Service.GetOrganizationalUsersAsync(organization);
        var members = new List<Member>();
        var roles = new List<IEnumerable<string>>();
        var gets = new List<Task<IEnumerable<string>>>();

        foreach (var user in users)
        {
            gets.Add(_auth0Service.GetUserOrganizationalRolesAsync(organization, user.UserId));

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

        return members;
    }

    [Authorize]
    [HttpGet("{organization}/members/{user}/roles")]
    public Task<IEnumerable<string>> GetUserOrganizationalRolesAsync(string organization, string user)
    {
        return _auth0Service.GetUserOrganizationalRolesAsync(organization, user);
    }

    [Authorize]
    [IgnoreAntiforgeryToken(Order = 1000)]
    [HttpDelete("{organization}/members/{user}")]
    public async Task<IActionResult> RemoveUserFromOrganizationAsync(string organization, string user)
    {
        await _auth0Service.RemoveUserFromOrganizationAsync(organization, user);

        return Ok();
    }

    [Authorize]
    [IgnoreAntiforgeryToken(Order = 1000)]
    [HttpPut("{organization}/members/{user}/roles")]
    public async Task<IActionResult> AddUserOrganizationalRolesAsync(string organization, string user, [FromBody] IEnumerable<string> roles)
    {
        await _auth0Service.AddUserOrganizationalRolesAsync(organization, user, roles);

        return Ok();
    }

    [Authorize]
    [HttpDelete("{organization}/members/{user}/roles")]
    [IgnoreAntiforgeryToken(Order = 1000)]
    public async Task<IActionResult> RemoveUserOrganizationalRolesAsync(string organization, string user, [FromBody] IEnumerable<string> roles)
    {
        await _auth0Service.RemoveUserOrganizationalRolesAsync(organization, user, roles);

        return Ok();
    }
}

