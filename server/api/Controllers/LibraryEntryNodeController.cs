﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries/{entryId}/versions/{entryVersion}/nodes")]
public class LibraryEntryNodeController : ControllerBase
{
    private readonly ILogger logger;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly LibraryEntryNodeResourceDataService nodeResourceDataService;
    private readonly ImportLibraryEntryService importLibraryEntryService;

    public LibraryEntryNodeController(ILoggerFactory loggerFactory, LibraryEntryNodeDataService nodeDataService, LibraryEntryVersionDataService versionDataService, LibraryEntryNodeResourceDataService nodeResourceDataService, LibrarySearchIndexService searchIndexService, ImportLibraryEntryService importLibraryEntryService)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryNodeController>();
        this.nodeDataService = nodeDataService;
        this.versionDataService = versionDataService;
        this.searchIndexService = searchIndexService;
        this.nodeResourceDataService = nodeResourceDataService;
        this.importLibraryEntryService = importLibraryEntryService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetNodesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = nodeDataService.CreateConnection())
            {
                await conn.OpenAsync();

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
            if (record.upserts == null) record.upserts = new LibraryEntryNode[] { };
            if (record.removeIds == null) record.removeIds = new string[] { };

            using (var conn = nodeDataService.CreateConnection())
            {
                await conn.OpenAsync();
                //
                //  Make the version actually exists
                //
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, entryId, entryVersion, record);
                await IndexLibraryEntryAsync(conn, owner, entryId);

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
            using (var conn = nodeResourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

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

            using (var conn = nodeResourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

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
    [HttpPost("{nodeId}/export")]
    public async Task<IActionResult> ExportProjectNodeToLibraryEntry(string owner, string entryId, int entryVersion, string nodeId, [FromBody] ProjectNodeToLibraryOptions options)
    {
        try
        {
            using (var conn = nodeResourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                var results = await importLibraryEntryService.ImportFromEntryNodeAsync(owner, entryId, entryVersion, nodeId, options);

                await IndexLibraryEntryAsync(conn, owner, results.newId);

                return Ok(results);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting node to another library entry");
            return new StatusCodeResult(500);
        }
    }
    private async Task IndexLibraryEntryAsync(SqlConnection conn, string owner, string entryId)
    {
        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
    }

}
