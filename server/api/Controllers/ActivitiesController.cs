using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ActivityDataService dataService;
    private readonly ProjectDataService projectDataService;

    public ActivitiesController(ILoggerFactory loggerFactory, ActivityDataService dataService, ProjectDataService projectDataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ActivitiesController>();
        this.dataService = dataService;
        this.db = db;
        this.projectDataService = projectDataService;
    }

    [Authorize]
    [HttpGet("topLevel/{topLevel}/count")]
    public async Task<IActionResult> GetCountForTopLevelAsync(string topLevel)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetCountForTopLevelAsync(conn, topLevel));
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
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetForTopLevelAsync(conn, topLevel, skip, take));
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
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetCountForChildAsync(conn, topLevel, child));
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
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetForChildAsync(conn, topLevel, child, skip, take));
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
            using (var conn = await db.CreateConnectionAsync())
            {
                foreach (var data in activities)
                    await dataService.InsertAsync(conn, data);

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

