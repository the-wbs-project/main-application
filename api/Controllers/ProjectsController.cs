using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ProjectsController> logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService nodeDataService;
    private readonly ProjectApprovalDataService approvalDataService;
    private readonly ProjectResourceDataService projectResourceDataService;
    private readonly ProjectNodeResourceDataService nodeResourceDataService;

    public ProjectsController(ILogger<ProjectsController> logger, TelemetryClient telemetry, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService, ProjectApprovalDataService approvalDataService, ProjectResourceDataService projectResourceDataService, ProjectNodeResourceDataService nodeResourceDataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.nodeDataService = nodeDataService;
        this.projectDataService = projectDataService;
        this.approvalDataService = approvalDataService;
        this.projectResourceDataService = projectResourceDataService;
        this.nodeResourceDataService = nodeResourceDataService;
    }

    [Authorize]
    [HttpGet("owner/{owner}")]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            return Ok(await projectDataService.GetByOwnerAsync(owner));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}")]
    public async Task<IActionResult> Put(string owner, Project project)
    {
        try
        {
            if (project.owner != owner) return BadRequest("Owner in url must match owner in body");

            await projectDataService.SetAsync(project);

            return Accepted();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string id)
    {
        try
        {
            return Ok(await projectDataService.GetByIdAsync(id));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}/roles")]
    public async Task<IActionResult> GetRolesByIdAsync(string owner, string id)
    {
        try
        {
            return Ok((await projectDataService.GetByIdAsync(id)).roles ?? new ProjectRole[] { });
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> GetNodesByIdAsync(string owner, string id)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await nodeDataService.GetByProjectAsync(conn, id));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/id/{id}/nodes")]
    public async Task<IActionResult> PutNode(string owner, string id, BulkSaveRecord<ProjectNode> record)
    {
        try
        {
            if (record.upserts == null) record.upserts = new ProjectNode[] { };
            if (record.removeIds == null) record.removeIds = new string[] { };
            //
            //  Make sure all records have same project id as provided above
            //
            foreach (var upsert in record.upserts)
            {
                if (upsert.projectId != id)
                    return BadRequest("All records must have same project id as provided in url");
            }

            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, id, record);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }


    [Authorize]
    [HttpGet("owner/{owner}/id/{id}/resources")]
    public async Task<IActionResult> GetProjectResources(string owner, string id)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await projectResourceDataService.GetListAsync(conn, id));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }


    [Authorize]
    [HttpGet("owner/{owner}/id/{projectId}/nodes/{nodeId}/resources")]
    public async Task<IActionResult> GetTaskResources(string owner, string projectId, string nodeId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                return Ok(await nodeResourceDataService.GetListAsync(conn, projectId, nodeId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    /*[Authorize]
    [HttpGet("owner/{owner}/id/{id}/resources/{resourceId}")]
    public async Task<IActionResult> GetProjectResourceById(string owner, string id, string resourceId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await resourceDataService.GetByIdAsync(conn, resourceId, id));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }*/

    /*[Authorize]
    [HttpGet("owner/{owner}/id/{projectId}/nodes/{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> GeTaskResourceById(string owner, string projectId, string nodeId, string resourceId)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                return Ok(await resourceDataService.GetByIdAsync(conn, resourceId, nodeId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }*/

    [Authorize]
    [HttpPut("owner/{owner}/id/{projectId}/resources/{resourceId}")]
    public async Task<IActionResult> PutProjectResources(string owner, string projectId, string resourceId, ResourceRecord resource)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await projectResourceDataService.SetAsync(conn, owner, projectId, resource);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/id/{projectId}/nodes/{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutTaskResources(string owner, string projectId, string nodeId, string resourceId, ResourceRecord resource)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                await nodeResourceDataService.SetAsync(conn, owner, projectId, nodeId, resource);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/id/{id}/approvals")]
    public async Task<IActionResult> GetApprovalsById(string owner, string id)
    {
        try
        {
            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await approvalDataService.GetByProjectAsync(conn, id));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/id/{id}/approvals")]
    public async Task<IActionResult> SetApprovalsById(string owner, string id, ProjectApprovalSaveRecord approval)
    {
        try
        {
            if (approval.projectId != id)
                return BadRequest("The project id in the body must match the project id in the url");

            using (var conn = projectDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await projectDataService.VerifyAsync(conn, owner, id))
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

