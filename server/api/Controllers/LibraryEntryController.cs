using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries")]
public class LibraryEntryController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibraryEntryDataService entryDataService;

    public LibraryEntryController(ILoggerFactory loggerFactory, LibraryEntryDataService entryDataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.entryDataService = entryDataService;
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

            using var conn = await db.CreateConnectionAsync();

            var entryObj = await entryDataService.SetAsync(conn, entry);

            return Ok(entryObj);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry");
            return new StatusCodeResult(500);
        }
    }
}
