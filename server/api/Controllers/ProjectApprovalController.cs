using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects/{projectId}/approvals")]
public class ProjectApprovalController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public ProjectApprovalController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ProjectApprovalController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetApprovalsById(string owner, string projectId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                if (!await data.Projects.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await data.ProjectApprovals.GetByProjectAsync(conn, projectId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting project approvals");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> SetApprovalsById(string owner, string projectId, ProjectApprovalSaveRecord approval)
    {
        try
        {
            if (approval.projectId != projectId)
                return BadRequest("The project id in the body must match the project id in the url");

            using (var conn = await data.CreateConnectionAsync())
            {
                if (!await data.Projects.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await data.ProjectApprovals.SetAsync(conn, owner, approval);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting project approvals");
            return new StatusCodeResult(500);
        }
    }
}

