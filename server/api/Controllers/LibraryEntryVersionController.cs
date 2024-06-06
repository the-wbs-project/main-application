using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries/{entryId}/versions")]
public class LibraryEntryVersionController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryVersionResourceDataService entryResourceDataService;
    private readonly ResourceFileStorageService resourceService;

    public LibraryEntryVersionController(ILoggerFactory loggerFactory, LibraryEntryDataService entryDataService, LibraryEntryVersionDataService versionDataService, LibraryEntryVersionResourceDataService entryResourceDataService, LibrarySearchIndexService searchIndexService, ResourceFileStorageService resourceService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryVersionController>();
        this.entryDataService = entryDataService;
        this.versionDataService = versionDataService;
        this.searchIndexService = searchIndexService;
        this.entryResourceDataService = entryResourceDataService;
        this.resourceService = resourceService;
        this.db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetVersionsAsync(string owner, string entryId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
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
    [HttpGet("{entryVersion}")]
    public async Task<IActionResult> GetVersionByIdAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
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
    [HttpPut("{entryVersion}")]
    public async Task<IActionResult> PutVersionAsync(string owner, string entryId, int entryVersion, LibraryEntryVersion model)
    {
        try
        {
            if (model.entryId != entryId) return BadRequest("EntryId in body must match EntryId in url");
            if (model.version != entryVersion) return BadRequest("Version in body must match Version in url");

            using (var conn = await db.CreateConnectionAsync())
            {
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
    [HttpGet("{entryVersion}/resources")]
    public async Task<IActionResult> GetResourcesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
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
    [HttpPut("{entryVersion}/resources/{resourceId}")]
    public async Task<IActionResult> PutResourceAsync(string owner, string entryId, int entryVersion, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = await db.CreateConnectionAsync())
            {
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
    [HttpGet("{entryVersion}/resources/{resourceId}/file")]
    public async Task<IActionResult> GetResourceFileAsync(string owner, string entryId, int entryVersion, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                var record = await entryResourceDataService.GetAsync(conn, entryId, entryVersion, resourceId);
                var file = await resourceService.GetLibraryResourceAsync(owner, entryId, entryVersion, resourceId);

                return File(file, "application/octet-stream", record.Resource);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{entryVersion}/resources/{resourceId}/file")]
    public async Task<IActionResult> PutNodeResourceFileAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId, IFormFile file)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                var record = await entryResourceDataService.GetAsync(conn, entryId, entryVersion, resourceId);
                var bytes = new byte[] { };

                using (var stream = file.OpenReadStream())
                {
                    bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, bytes.Length);
                }

                await resourceService.SaveLibraryResourceAsync(owner, entryId, entryVersion, resourceId, bytes);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry version resources");
            return new StatusCodeResult(500);
        }
    }

    private async Task IndexLibraryEntryAsync(SqlConnection conn, string owner, string entryId)
    {
        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
    }

}

