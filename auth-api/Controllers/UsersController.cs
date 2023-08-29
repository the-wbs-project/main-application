using Auth0.ManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;
using Wbs.AuthApi.Services;

namespace Wbs.AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly Auth0Service _auth0Service;

    public UsersController(ILogger<UsersController> logger, Auth0Service auth0Service)
    {
        _logger = logger;
        _auth0Service = auth0Service;
    }

    [Authorize]
    [HttpGet("{user}")]
    public async Task<UserLite> GetUserAsync(string user)
    {
        var obj = await _auth0Service.GetUserAsync(user);

        return new UserLite
        {
            Id = obj.UserId,
            Name = obj.FullName,
            Email = obj.Email
        };
    }

    [Authorize]
    [HttpGet("{user}/roles")]
    public async Task<ActionResult> GetUserSiteRolesAsync(string user)
    {
        try
        {
            var roles = await _auth0Service.GetUserSiteRolesAsync(user);

            return Ok(roles);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting user site roles");
            return StatusCode(500, e.Message);
        }
    }

    [Authorize]
    [HttpGet("{user}/memberships")]
    public Task<IEnumerable<Organization>> GetUserMembershipsAsync(string user)
    {
        return _auth0Service.GetUserOrganizationsAsync(user);
    }
}

