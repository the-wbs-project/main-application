using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Attributes;
using Wbs.Core.DataServices;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;
    private readonly AuthConverterService converter;

    public MembersController(ILoggerFactory loggerFactory, DataServiceFactory data, AuthConverterService converter)
    {
        logger = loggerFactory.CreateLogger<MembersController>();
        this.data = data;
        this.converter = converter;
    }

    [HttpGet("migrate")]
    public async Task<IActionResult> Migrate()
    {
        await converter.Run();

        return Accepted();
    }

    [HttpGet]
    [WorkerAuthorize]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            using var conn = await data.CreateConnectionAsync();

            return Ok(await data.OrganizationRoles.GetAllAsync(conn));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all roles");
            return new StatusCodeResult(500);
        }
    }

    [WorkerAuthorize]
    [HttpGet("site-roles")]
    public async Task<IActionResult> GetSiteRolesAsync()
    {
        try
        {
            using var conn = await data.CreateConnectionAsync();

            return Ok(await data.OrganizationRoles.GetSiteRolesAsync(conn));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all site roles");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{organizationId}/users/{userId}/roles")]
    public async Task<IActionResult> PutRolesForUser(string organizationId, string userId, string[] roles)
    {
        try
        {
            using var conn = await data.CreateConnectionAsync();

            await data.OrganizationRoles.SetRolesAsync(conn, organizationId, userId, roles);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving org {id} roles for user {userId}", organizationId, userId);
            return new StatusCodeResult(500);
        }
    }
}

