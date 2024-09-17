using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries/{entryId}/versions/{entryVersion}/nodes")]
public class LibraryEntryNodeController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;

    public LibraryEntryNodeController(ILoggerFactory loggerFactory, LibraryEntryNodeDataService nodeDataService, LibraryEntryVersionDataService versionDataService, ImportLibraryEntryService importLibraryEntryService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryNodeController>();
        this.nodeDataService = nodeDataService;
        this.versionDataService = versionDataService;
        this.importLibraryEntryService = importLibraryEntryService;
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

                await nodeDataService.SetAsync(conn, entryId, entryVersion, record.upserts ?? [], record.removeIds ?? []);
                await versionDataService.MarkAsUpdatedAsync(conn, entryId, entryVersion);

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
    [HttpPost("{nodeId}/export/{targetOwnerId}")]
    public async Task<IActionResult> ExportProjectNodeToLibraryEntry(string owner, string entryId, int entryVersion, string nodeId, string targetOwnerId, [FromBody] ProjectNodeToLibraryOptions options)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var newId = await importLibraryEntryService.ImportFromEntryNodeAsync(conn, targetOwnerId, owner, entryId, entryVersion, nodeId, options);

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

