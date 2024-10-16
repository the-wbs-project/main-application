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
    private readonly ILogger logger;
    private readonly DataServiceFactory data;
    private readonly ImportLibraryEntryService importService;

    public LibraryEntryNodeController(ILoggerFactory loggerFactory, DataServiceFactory data, ImportLibraryEntryService importService)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryNodeController>();
        this.data = data;
        this.importService = importService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetNodesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                if (!await data.LibraryVersions.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                return Ok(await data.LibraryNodes.GetListAsync(conn, entryId, entryVersion));
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

            using (var conn = await data.CreateConnectionAsync())
            {
                //
                //  Make the version actually exists
                //
                if (!await data.LibraryVersions.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                await data.LibraryNodes.SetAsync(conn, entryId, entryVersion, record.upserts ?? [], record.removeIds ?? []);
                await data.LibraryVersions.MarkAsUpdatedAsync(conn, entryId, entryVersion);

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
            using (var conn = await data.CreateConnectionAsync())
            {
                var newId = await importService.ImportFromEntryNodeAsync(conn, targetOwnerId, owner, entryId, entryVersion, nodeId, options);

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

