using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/projects/{projectId}/nodes")]
public class ProjectNodeController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService nodeDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;

    public ProjectNodeController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService, ImportLibraryEntryService importLibraryEntryService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ProjectNodeController>();
        this.nodeDataService = nodeDataService;
        this.projectDataService = projectDataService;
        this.importLibraryEntryService = importLibraryEntryService;
        this.db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetNodesByIdAsync(string owner, string projectId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                return Ok(await nodeDataService.GetByProjectAsync(conn, projectId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting project nodes");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> PutNode(string owner, string projectId, BulkSaveRecord<ProjectNode> record)
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
                if (upsert.projectId != projectId)
                    return BadRequest("All records must have same project id as provided in url");
            }

            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, projectId, record);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving project nodes");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{nodeId}/export/libraryEntry")]
    public async Task<IActionResult> ExportProjectNodeToLibraryEntry(string owner, string projectId, string nodeId, [FromBody] ProjectNodeToLibraryOptions options)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var entryId = await importLibraryEntryService.ImportFromProjectNodeAsync(conn, owner, projectId, nodeId, options);

                return Ok(entryId);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting project node to library entry");
            return new StatusCodeResult(500);
        }
    }
}

