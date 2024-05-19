using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ListDataService dataService;

    public ListsController(ILoggerFactory loggerFactory, ListDataService dataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ListsController>();
        this.dataService = dataService;
        this.db = db;
    }

    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetAsync(conn, type));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving lists");
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ListItem resource)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                await dataService.SetAsync(conn, resource);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving lists");
            return new StatusCodeResult(500);
        }
    }

    [HttpDelete("{type}/{id}")]
    public async Task<IActionResult> Delete(string type, string id)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                await dataService.DeleteAsync(conn, type, id);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting lists");
            return new StatusCodeResult(500);
        }
    }
}

