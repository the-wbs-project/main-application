using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatchersController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;
    private readonly LibrarySearchIndexService searchIndexService;

    public WatchersController(ILoggerFactory loggerFactory, LibrarySearchIndexService searchIndexService, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<WatchersController>();
        this.searchIndexService = searchIndexService;
        this.data = data;
    }

    [Authorize]
    [HttpGet("library/watcher/{watcherId}")]
    public async Task<IActionResult> GetEntriesAsync(string watcherId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.WatcherLibraryEntries.GetEntriesAsync(conn, watcherId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library entries for watcher");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("library/count/{ownerId}/{entryId}")]
    public async Task<IActionResult> GetCountAsync(string ownerId, string entryId)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.WatcherLibraryEntries.GetCountAsync(conn, ownerId, entryId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library watcher count");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("library")]
    public async Task<IActionResult> SetLibraryWatcherAsync([FromBody] WatcherInfo watcherData)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                //
                //  Delete not using delete verb because it technically doesn't supports a body, so put and delete would look too different
                //
                if (watcherData.action == "add")
                    await data.WatcherLibraryEntries.SetAsync(conn, watcherData.ownerId, watcherData.entryId, watcherData.watcherId);
                else if (watcherData.action == "delete")
                    await data.WatcherLibraryEntries.DeleteAsync(conn, watcherData.ownerId, watcherData.entryId, watcherData.watcherId);

                await searchIndexService.PushToSearchAsync(conn, watcherData.ownerId, [watcherData.entryId]);
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting library watcher");
            return new StatusCodeResult(500);
        }
    }

    public class WatcherInfo
    {
        public string watcherId { get; set; }
        public string ownerId { get; set; }
        public string entryId { get; set; }
        public string action { get; set; }
    }
}

