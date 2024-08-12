using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/libraries")]
public class LibraryController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly LibrarySearchService searchService;
    private readonly LibraryEntryViewDataService viewDataService;

    public LibraryController(ILoggerFactory loggerFactory, LibrarySearchService searchService, DbService db, LibraryEntryViewDataService viewDataService)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryController>();
        this.searchService = searchService;
        this.db = db;
        this.viewDataService = viewDataService;
    }

    [Authorize]
    [HttpGet("drafts/{owner}/{types}")]
    public async Task<IActionResult> GetDraftList(string owner, string types)
    {
        try
        {
            using var conn = await db.CreateConnectionAsync();

            return Ok(await viewDataService.GetDraftsAsync(conn, owner, User.Identity.Name, types));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching library drafts");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("internal/{owner}")]
    public async Task<IActionResult> SearchInternal(string owner, LibraryFilters filters)
    {
        try
        {
            using var conn = await db.CreateConnectionAsync();

            var userId = User.Identity.Name;

            return Ok(await searchService.RunInternalQueryAsync(conn, owner, userId, filters));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching library entries");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("public")]
    public async Task<IActionResult> SearchPublic(LibraryFilters filters)
    {
        try
        {
            using var conn = await db.CreateConnectionAsync();

            var userId = User.Identity.Name;

            return Ok(await searchService.RunPublicQueryAsync(conn, userId, filters));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching library entries");
            return new StatusCodeResult(500);
        }
    }
}
