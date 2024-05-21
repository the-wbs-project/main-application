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
    private readonly ProjectNodeResourceDataService nodeResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;
    private readonly ResourceFileStorageService resourceService;
    private readonly LibrarySearchIndexService searchIndexService;

    public ProjectNodeController(ILoggerFactory loggerFactory, ProjectDataService projectDataService, ProjectNodeDataService nodeDataService, ProjectNodeResourceDataService nodeResourceDataService, ImportLibraryEntryService importLibraryEntryService, ResourceFileStorageService resourceService, DbService db, LibrarySearchIndexService searchIndexService)
    {
        logger = loggerFactory.CreateLogger<ProjectNodeController>();
        this.nodeDataService = nodeDataService;
        this.projectDataService = projectDataService;
        this.nodeResourceDataService = nodeResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
        this.resourceService = resourceService;
        this.db = db;
        this.searchIndexService = searchIndexService;
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
    [HttpGet("{nodeId}/resources")]
    public async Task<IActionResult> GetTaskResources(string owner, string projectId, string nodeId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                return Ok(await nodeResourceDataService.GetListAsync(conn, projectId, nodeId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting project node resources");
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

                await searchIndexService.VerifyIndexAsync();
                await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);

                return Ok(entryId);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting project node to library entry");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutTaskResource(string owner, string projectId, string nodeId, string resourceId, ResourceRecord resource)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
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
            logger.LogError(ex, "Error saving project node resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{nodeId}/resources/{resourceId}/file")]
    public async Task<IActionResult> GetNodeResourceFileAsync(string owner, string projectId, string nodeId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                var record = await nodeResourceDataService.GetAsync(conn, projectId, nodeId, resourceId);
                var file = await resourceService.GetProjectTaskResourceAsync(owner, projectId, nodeId, resourceId);

                return File(file, "application/octet-stream", record.Resource);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{nodeId}/resources/{resourceId}/file")]
    public async Task<IActionResult> PutTaskResourceFile(string owner, string projectId, string nodeId, string resourceId, IFormFile file)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await projectDataService.VerifyAsync(conn, owner, projectId))
                    return BadRequest("Project not found for the owner provided.");

                if (!await nodeDataService.VerifyAsync(conn, projectId, nodeId))
                    return BadRequest("Node not found for the project provided.");

                var record = await nodeResourceDataService.GetAsync(conn, projectId, nodeId, resourceId);
                var bytes = new byte[] { };

                using (var stream = file.OpenReadStream())
                {
                    bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, bytes.Length);
                }

                await resourceService.SaveProjectTaskResourceAsync(owner, projectId, nodeId, resourceId, bytes);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }
}

