using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries/{entryId}/versions/{entryVersion}/nodes")]
public class LibraryEntryNodeController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly LibraryEntryNodeResourceDataService nodeResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;
    private readonly ResourceFileStorageService resourceService;

    public LibraryEntryNodeController(ILoggerFactory loggerFactory, LibraryEntryNodeDataService nodeDataService, LibraryEntryVersionDataService versionDataService, LibraryEntryNodeResourceDataService nodeResourceDataService, LibrarySearchIndexService searchIndexService, ImportLibraryEntryService importLibraryEntryService, ResourceFileStorageService resourceService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryNodeController>();
        this.nodeDataService = nodeDataService;
        this.versionDataService = versionDataService;
        this.searchIndexService = searchIndexService;
        this.nodeResourceDataService = nodeResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
        this.resourceService = resourceService;
        this.db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetNodesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                return Ok(await nodeDataService.GetListAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry version tasks");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> PutNode(string owner, string entryId, int entryVersion, BulkSaveRecord<LibraryEntryNode> record)
    {
        try
        {
            if (record.upserts == null) record.upserts = [];
            if (record.removeIds == null) record.removeIds = [];

            using (var conn = await db.CreateConnectionAsync())
            {
                //
                //  Make the version actually exists
                //
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, entryId, entryVersion, record);

                searchIndexService.AddToLibraryQueue(owner, entryId);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version tasks");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{nodeId}/resources")]
    public async Task<IActionResult> GetNodeResourcesAsync(string owner, string entryId, int entryVersion, string nodeId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                return Ok(await nodeResourceDataService.GetListAsync(conn, entryId, entryVersion, nodeId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry version task resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutNodeResourceAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                await nodeResourceDataService.SetAsync(conn, owner, entryId, entryVersion, nodeId, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{nodeId}/resources/{resourceId}/file")]
    public async Task<IActionResult> GetNodeResourceFileAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                var record = await nodeResourceDataService.GetAsync(conn, entryId, entryVersion, nodeId, resourceId);
                var file = await resourceService.GetLibraryTaskResourceAsync(owner, entryId, entryVersion, nodeId, resourceId);

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
    public async Task<IActionResult> PutNodeResourceFileAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId, IFormFile file)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                var record = await nodeResourceDataService.GetAsync(conn, entryId, entryVersion, nodeId, resourceId);
                var bytes = new byte[] { };

                using (var stream = file.OpenReadStream())
                {
                    bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, bytes.Length);
                }

                await resourceService.SaveLibraryTaskResourceAsync(owner, entryId, entryVersion, nodeId, resourceId, bytes);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version task resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("{nodeId}/export")]
    public async Task<IActionResult> ExportProjectNodeToLibraryEntry(string owner, string entryId, int entryVersion, string nodeId, [FromBody] ProjectNodeToLibraryOptions options)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var newId = await importLibraryEntryService.ImportFromEntryNodeAsync(conn, owner, entryId, entryVersion, nodeId, options);

                searchIndexService.AddToLibraryQueue(owner, newId);

                return Ok(newId);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting node to another library entry");
            return new StatusCodeResult(500);
        }
    }
}

