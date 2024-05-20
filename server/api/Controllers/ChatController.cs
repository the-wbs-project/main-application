using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ChatDataService dataService;

    public ChatController(ILoggerFactory loggerFactory, ChatDataService dataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ChatController>();
        this.dataService = dataService;
        this.db = db;
    }

    [Authorize]
    [HttpGet("thread/{threadId}/comments/skip/{skip}/take/{take}")]
    public async Task<IActionResult> GetPageAsync(string threadId, int skip, int take)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetPageAsync(conn, threadId, skip, take));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving chat comments");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("thread/{threadId}/comments/{timestamp}/count")]
    public async Task<IActionResult> GetNewCommentCount(string threadId, DateTimeOffset timestamp)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetNewCommentCount(conn, threadId, timestamp));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving chat comments");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("thread/{threadId}")]
    public async Task<IActionResult> Post(string threadId, ChatComment comment)
    {
        try
        {
            if (threadId != comment.threadId)
                return BadRequest();

            using (var conn = await db.CreateConnectionAsync())
            {
                await dataService.InsertAsync(conn, comment);

                comment.timestamp = DateTimeOffset.UtcNow;
                return Ok(comment);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving chat comment");
            return new StatusCodeResult(500);
        }
    }
}

