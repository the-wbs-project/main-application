using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;
using Wbs.Api.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects/{projectId}/approvals")]
public class ProjectApprovalController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ProjectApprovalController> logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectApprovalDataService approvalDataService;

    public ProjectApprovalController(ILogger<ProjectApprovalController> logger, TelemetryClient telemetry, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService, ProjectApprovalDataService approvalDataService, ProjectResourceDataService projectResourceDataService, ProjectNodeResourceDataService nodeResourceDataService, ImportLibraryEntryService importLibraryEntryService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.projectDataService = projectDataService;
        this.approvalDataService = approvalDataService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetApprovalsById(string owner, string projectId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await approvalDataService.GetByProjectAsync(conn, projectId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
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

            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await approvalDataService.SetAsync(conn, owner, approval);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

