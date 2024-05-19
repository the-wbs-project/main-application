using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChecklistsController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ChecklistDataService dataService;

    public ChecklistsController(ILoggerFactory loggerFactory, ChecklistDataService dataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ChecklistsController>();
        this.dataService = dataService;
        this.db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync()
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetAsync(conn));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving checklists");
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ChecklistGroup[] groups)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                await dataService.SetAsync(conn, groups);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving checklists");
            return new StatusCodeResult(500);
        }
    }
}
