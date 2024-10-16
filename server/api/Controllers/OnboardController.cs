using Auth0.ManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Attributes;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[WorkerAuthorize]
[Route("api/[controller]")]
public class OnboardController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;
    private readonly OnboardService service;

    public OnboardController(ILoggerFactory loggerFactory, DataServiceFactory data, OnboardService service)
    {
        logger = loggerFactory.CreateLogger<InvitesController>();
        this.data = data;
        this.service = service;
    }

    [HttpGet("{organizationId}/{inviteId}")]
    public async Task<IActionResult> GetInvite(string organizationId, string inviteId)
    {
        try
        {
            return Ok(await service.GetRecordAsync(organizationId, inviteId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting org {id} invites", organizationId);
            return new StatusCodeResult(500);
        }
    }

    [HttpPost("{organizationId}/{inviteId}")]
    public async Task<IActionResult> CreateUser(string organizationId, string inviteId, OnboardResults results)
    {
        try
        {
            var user = await service.OnboardAsync(organizationId, inviteId, results);

            Console.WriteLine("User created", user?.UserId);

            return Ok(user.UserId);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            logger.LogError(ex, "Error trying to onboard user");
            return new StatusCodeResult(500);
        }
    }
}