using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvitesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public InvitesController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<InvitesController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet("{organizationId}/includeAll/{includeAll}")]
    public async Task<IActionResult> GetInvites(string organizationId, bool includeAll)
    {
        try
        {
            var conn = await data.CreateConnectionAsync();

            var invites = await data.Invites.GetAsync(conn, organizationId, includeAll);

            return Ok(invites);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting org {id} invites", organizationId);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{organizationId}/{inviteId}")]
    public async Task<IActionResult> GetInvite(string organizationId, string inviteId)
    {
        try
        {
            var conn = await data.CreateConnectionAsync();

            var invite = await data.Invites.GetByIdAsync(conn, organizationId, inviteId);

            return Ok(invite);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting invite {orgId} {inviteId}", organizationId, inviteId);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{organizationId}")]
    public async Task<IActionResult> CreateInvite(string organizationId, Invite invite)
    {
        try
        {
            var conn = await data.CreateConnectionAsync();

            await data.Invites.CreateAsync(conn, invite);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error sending org {id} invites", organizationId);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{organizationId}/{inviteId}")]
    public async Task<IActionResult> UpdateInvite(string organizationId, string inviteId, Invite invite)
    {
        try
        {
            var conn = await data.CreateConnectionAsync();

            if (invite.OrganizationId != organizationId) return BadRequest("The Orgnization Id in the URL doesn't match the value in the body>");
            if (invite.Id != inviteId) return BadRequest("The Invite Id in the URL doesn't match the value in the body>");

            await data.Invites.UpdateAsync(conn, invite);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating org {id} invites", organizationId);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{organizationId}/{inviteId}")]
    public async Task<IActionResult> DeleteInvite(string organizationId, string inviteId)
    {
        try
        {
            var conn = await data.CreateConnectionAsync();

            await data.Invites.CancelAsync(conn, organizationId, inviteId);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error cancelling invite {id}", inviteId);
            return new StatusCodeResult(500);
        }
    }
}