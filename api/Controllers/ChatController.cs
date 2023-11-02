using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ChatController> logger;
    private readonly ChatDataService dataService;

    public ChatController(TelemetryClient telemetry, ILogger<ChatController> logger, ChatDataService dataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.dataService = dataService;
    }

    [Authorize]
    [HttpGet("thread/{threadId}/comments/skip/{skip}/take/{take}")]
    public async Task<IActionResult> GetPageAsync(string threadId, int skip, int take)
    {
        try
        {
            return Ok(await dataService.GetPageAsync(threadId, skip, take));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("thread/{threadId}/comments/{timestamp}/count")]
    public async Task<IActionResult> GetNewCommentCount(string threadId, DateTimeOffset timestamp)
    {
        try
        {
            return Ok(await dataService.GetNewCommentCount(threadId, timestamp));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
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

            await dataService.InsertAsync(comment);

            return NoContent();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

