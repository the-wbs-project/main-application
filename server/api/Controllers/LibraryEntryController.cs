using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries")]
public class LibraryEntryController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryDataService entryDataService;

    public LibraryEntryController(ILoggerFactory loggerFactory, LibraryEntryDataService entryDataService, LibrarySearchIndexService searchIndexService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.entryDataService = entryDataService;
        this.searchIndexService = searchIndexService;
        this.db = db;
    }

    [Authorize]
    [HttpGet("{entryId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string entryId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await entryDataService.GetByIdAsync(conn, owner, entryId));
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
            if (entry.OwnerId != owner) return BadRequest("Owner in url must match owner in body");
            if (entry.Id != entryId) return BadRequest("Id in url must match owner in body");

            using (var conn = await db.CreateConnectionAsync())
            {
                await entryDataService.SetAsync(conn, entry);

                if (entry.PublishedVersion.HasValue)
                    await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
            }
            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry");
            return new StatusCodeResult(500);
        }
    }
}
