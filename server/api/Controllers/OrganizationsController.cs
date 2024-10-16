using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public OrganizationsController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<OrganizationsController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            using var conn = await data.CreateConnectionAsync();

            return Ok(await data.Organizations.GetAllAsync(conn));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all organizations");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        try
        {
            using var conn = await data.CreateConnectionAsync();

            return Ok(await data.Organizations.GetByIdAsync(conn, id));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting organization {id}", id);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, Organization organization)
    {
        try
        {
            if (organization.Id != id) return BadRequest("Organization ID in url must match id in body");

            using var conn = await data.CreateConnectionAsync();

            await data.Organizations.SetAsync(conn, organization);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting organization {id}", id);
            return new StatusCodeResult(500);
        }
    }
}

