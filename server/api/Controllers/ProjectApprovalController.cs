using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects/{projectId}/approvals")]
public class ProjectApprovalController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectApprovalDataService approvalDataService;

    public ProjectApprovalController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ProjectApprovalDataService approvalDataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ProjectApprovalController>();
        this.projectDataService = projectDataService;
        this.approvalDataService = approvalDataService;
        this.db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetApprovalsById(string owner, string projectId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await approvalDataService.GetByProjectAsync(conn, projectId));
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

            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await approvalDataService.SetAsync(conn, owner, approval);

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

