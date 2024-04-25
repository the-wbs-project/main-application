using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries")]
public class LibraryEntryController : ControllerBase
{
    private readonly ILogger<LibraryEntryController> logger;
    private readonly LibrarySearchService searchService;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly LibraryEntryVersionResourceDataService entryResourceDataService;
    private readonly LibraryEntryNodeResourceDataService nodeResourceDataService;

    public LibraryEntryController(ILogger<LibraryEntryController> logger, LibrarySearchService searchService, LibraryEntryDataService entryDataService, LibraryEntryNodeDataService nodeDataService, LibraryEntryVersionDataService versionDataService, LibraryEntryVersionResourceDataService entryResourceDataService, LibraryEntryNodeResourceDataService nodeResourceDataService, LibrarySearchIndexService searchIndexService)
    {
        this.logger = logger;
        this.searchService = searchService;
        this.nodeDataService = nodeDataService;
        this.entryDataService = entryDataService;
        this.versionDataService = versionDataService;
        this.searchIndexService = searchIndexService;
        this.entryResourceDataService = entryResourceDataService;
        this.nodeResourceDataService = nodeResourceDataService;
    }

    [Authorize]
    [HttpPost("search")]
    public async Task<IActionResult> Search(string owner, LibraryFilters filters)
    {
        try
        {
            var results = await searchService.RunQueryAsync(owner, filters);
            //
            //  For not remove the tasks
            //
            return Ok(results);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching library entries");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string entryId)
    {
        try
        {
            return Ok(await entryDataService.GetByIdAsync(owner, entryId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving library entry by id");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{entryId}")]
    public async Task<IActionResult> Put(string owner, string entryId, LibraryEntry entry)
    {
        try
        {
            if (entry.owner != owner) return BadRequest("Owner in url must match owner in body");
            if (entry.id != entryId) return BadRequest("Id in url must match owner in body");

            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();
                await entryDataService.SetAsync(conn, entry);
                await IndexLibraryEntryAsync(conn, owner, entryId);
            }
            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}/editors")]
    public async Task<IActionResult> GetEditorsByIdAsync(string owner, string entryId)
    {
        try
        {
            var entry = await entryDataService.GetByIdAsync(owner, entryId);

            return Ok(entry.editors ?? new string[] { });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry editors");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}/versions")]
    public async Task<IActionResult> GetVersionsAsync(string owner, string entryId)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                return Ok(await versionDataService.GetListAsync(conn, entryId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry versions");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}/versions/{entryVersion}")]
    public async Task<IActionResult> GetVersionByIdAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                return Ok(await versionDataService.GetByIdAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry version by id");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{entryId}/versions/{entryVersion}")]
    public async Task<IActionResult> PutVersionAsync(string owner, string entryId, int entryVersion, LibraryEntryVersion model)
    {
        try
        {
            if (model.entryId != entryId) return BadRequest("EntryId in body must match EntryId in url");
            if (model.version != entryVersion) return BadRequest("Version in body must match Version in url");

            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                await versionDataService.SetAsync(conn, owner, model);
                await IndexLibraryEntryAsync(conn, owner, entryId);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry versions");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}/versions/{entryVersion}/nodes")]
    public async Task<IActionResult> GetNodesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
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
    [HttpPut("{entryId}/versions/{entryVersion}/nodes")]
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
    [HttpGet("{entryId}/versions/{entryVersion}/resources")]
    public async Task<IActionResult> GetResourcesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = entryResourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                return Ok(await entryResourceDataService.GetListAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry version resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{entryId}/versions/{entryVersion}/resources/{resourceId}")]
    public async Task<IActionResult> PutResourceAsync(string owner, string entryId, int entryVersion, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = entryResourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                await entryResourceDataService.SetAsync(conn, owner, entryId, entryVersion, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{entryId}/versions/{entryVersion}/nodes/{nodeId}/resources")]
    public async Task<IActionResult> GetNodeResourcesAsync(string owner, string entryId, int entryVersion, string nodeId)
    {
        try
        {
            using (var conn = entryResourceDataService.CreateConnection())
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
    [HttpPut("{entryId}/versions/{entryVersion}/nodes/{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutNodeResourceAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = entryResourceDataService.CreateConnection())
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


    private async Task IndexLibraryEntryAsync(SqlConnection conn, string owner, string entryId)
    {
        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
    }

}

