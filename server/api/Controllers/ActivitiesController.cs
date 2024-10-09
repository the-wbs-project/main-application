using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public ActivitiesController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ActivitiesController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/count")]
    public async Task<IActionResult> GetCountForTopLevelAsync(string topLevel)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Activities.GetCountForTopLevelAsync(conn, topLevel));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving count for activities of top level");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/{skip}/{take}")]
    public async Task<IActionResult> GetForTopLevelAsync(string topLevel, int skip, int take)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Activities.GetForTopLevelAsync(conn, topLevel, skip, take));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving activities for top level");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/child/{child}/count")]
    public async Task<IActionResult> GetForChildAsync(string topLevel, string child)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Activities.GetCountForChildAsync(conn, topLevel, child));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving count for activities of child");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/child/{child}/{skip}/{take}")]
    public async Task<IActionResult> GetForChildAsync(string topLevel, string child, int skip, int take)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Activities.GetForChildAsync(conn, topLevel, child, skip, take));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving activities for child");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(Activity[] activities)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
            {
                foreach (var activityData in activities)
                    await data.Activities.InsertAsync(conn, activityData);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving activities");
            return new StatusCodeResult(500);
        }
    }
}

