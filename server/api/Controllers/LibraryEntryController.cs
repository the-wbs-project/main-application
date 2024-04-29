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
    private readonly ILogger logger;
    private readonly LibrarySearchService searchService;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibraryEntryDataService entryDataService;

    public LibraryEntryController(ILoggerFactory loggerFactory, LibrarySearchService searchService, LibraryEntryDataService entryDataService, LibrarySearchIndexService searchIndexService)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.searchService = searchService;
        this.entryDataService = entryDataService;
        this.searchIndexService = searchIndexService;
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

            return Ok(entry.editors ?? []);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entry editors");
            return new StatusCodeResult(500);
        }
    }

    private async Task IndexLibraryEntryAsync(SqlConnection conn, string owner, string entryId)
    {
        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
    }

}

