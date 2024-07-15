using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
    private readonly LibrarySearchService searchService;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryDataService entryDataService;

    public LibraryEntryController(ILoggerFactory loggerFactory, LibrarySearchService searchService, LibraryEntryDataService entryDataService, LibrarySearchIndexService searchIndexService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.searchService = searchService;
        this.entryDataService = entryDataService;
        this.searchIndexService = searchIndexService;
        this.db = db;
    }

    [Authorize]
    [HttpPost("search")]
    public async Task<IActionResult> Search(string owner, LibraryFilters filters)
    {
        try
        {
            using var conn = await db.CreateConnectionAsync();

            if (string.IsNullOrWhiteSpace(filters.searchText))
                return Ok(await entryDataService.GetFilteredAsync(conn, owner, filters));

            return Ok(await searchService.RunQueryAsync(owner, filters));
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
            if (entry.owner != owner) return BadRequest("Owner in url must match owner in body");
            if (entry.id != entryId) return BadRequest("Id in url must match owner in body");

            using (var conn = await db.CreateConnectionAsync())
            {
                await entryDataService.SetAsync(conn, entry);

                searchIndexService.AddToLibraryQueue(owner, entryId);
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
            using (var conn = await db.CreateConnectionAsync())
            {
                var entry = await entryDataService.GetByIdAsync(conn, owner, entryId);

                return Ok(entry.editors ?? []);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry editors");
            return new StatusCodeResult(500);
        }
    }
}
