using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/portfolio/{owner}/library/entries")]
public class LibraryEntryController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public LibraryEntryController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet("{entryId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string entryId)
    {
        try
        {

            using var conn = await data.CreateConnectionAsync();

            return Ok(await data.LibraryEntries.GetByIdAsync(conn, owner, entryId));
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

            using var conn = await data.CreateConnectionAsync();

            var entryObj = await data.LibraryEntries.SetAsync(conn, entry);

            return Ok(entryObj);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving library entry");
            return new StatusCodeResult(500);
        }
    }
}
