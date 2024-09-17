using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Models;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;
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
    private readonly VersioningService versioningService;

    public LibraryEntryVersionController(ILoggerFactory loggerFactory, LibraryEntryDataService entryDataService, LibraryEntryVersionDataService versionDataService, LibrarySearchIndexService searchIndexService, DbService db, VersioningService versioningService)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryVersionController>();
        this.entryDataService = entryDataService;
        this.versionDataService = versionDataService;
        this.searchIndexService = searchIndexService;
        this.db = db;
        this.versioningService = versioningService;
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
            if (model.EntryId != entryId) return BadRequest("EntryId in body must match EntryId in url");
            if (model.Version != entryVersion) return BadRequest("Version in body must match Version in url");

            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                await versionDataService.SetAsync(conn, owner, model);

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
    [HttpPut("{entryVersion}/replicate")]
    public async Task<IActionResult> ReplicateVersionAsync(string owner, string entryId, int entryVersion, ReplicateVersionData model)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");


                var newVersion = await versioningService.ReplicateAsync(conn, owner, entryId, entryVersion, model.Alias, User.Identity.Name);

                return Ok(newVersion);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry versions");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{entryVersion}/publish")]
    public async Task<IActionResult> PublishVersionAsync(string owner, string entryId, int entryVersion, LibraryEntryVersion model)
    {
        try
        {
            if (model.EntryId != entryId) return BadRequest("EntryId in body must match EntryId in url");
            if (model.Version != entryVersion) return BadRequest("Version in body must match Version in url");

            using (var conn = await db.CreateConnectionAsync())
            {
                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");


                var entry = await entryDataService.GetByIdAsync(conn, owner, entryId);
                //
                //  Retire any existing published version
                //
                if (entry.PublishedVersion.HasValue && entry.PublishedVersion.Value != entryVersion)
                {
                    var otherVersion = await versionDataService.GetByIdAsync(conn, entryId, entry.PublishedVersion.Value);

                    otherVersion.Status = "retired";
                    await versionDataService.SetAsync(conn, owner, otherVersion);
                }
                model.LastModified = DateTime.UtcNow;
                entry.PublishedVersion = entryVersion;

                await versionDataService.SetAsync(conn, owner, model);
                await entryDataService.SetAsync(conn, entry);
                await searchIndexService.PushToSearchAsync(conn, entry, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry versions");
            return new StatusCodeResult(500);
        }
    }
}

