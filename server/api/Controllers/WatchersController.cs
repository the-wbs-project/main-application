using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core;
using Wbs.Core.DataServices;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatchersController : ControllerBase
{
    private readonly ILogger logger;
    private readonly QueueService queueService;
    private readonly WatcherLibraryEntryDataService libraryDataService;

    public WatchersController(ILoggerFactory loggerFactory, WatcherLibraryEntryDataService libraryDataService, QueueService queueService)
    {
        logger = loggerFactory.CreateLogger<WatchersController>();
        this.libraryDataService = libraryDataService;
        this.queueService = queueService;
    }

    [Authorize]
    [HttpGet("library/watcher/{watcherId}")]
    public async Task<IActionResult> GetEntriesAsync(string watcherId)
    {
        try
        {
            return Ok(await libraryDataService.GetEntriesAsync(watcherId));
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
            return Ok(await libraryDataService.GetCountAsync(ownerId, entryId));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting library watcher count");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("library")]
    public async Task<IActionResult> SetLibraryWatcherAsync([FromBody] WatcherInfo data)
    {
        try
        {
            //
            //  Delete not using delete verb because it technically doesn't supports a body, so put and delete would look too different
            //
            if (data.action == "add")
                await libraryDataService.SetAsync(data.ownerId, data.entryId, data.watcherId);
            else if (data.action == "delete")
                await libraryDataService.DeleteAsync(data.ownerId, data.entryId, data.watcherId);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting library watcher");
            return new StatusCodeResult(500);
        }
        finally
        {
            await queueService.AddAsync(QUEUES.LIBRARY_SEARCH_ITEM, $"{data.ownerId}|{data.entryId}");
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

