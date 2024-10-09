using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public ListsController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ListsController>();
        this.data = data;
    }

    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Lists.GetAsync(conn, type));
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
            using (var conn = await data.CreateConnectionAsync())
                await data.Lists.SetAsync(conn, resource);

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
            using (var conn = await data.CreateConnectionAsync())
                await data.Lists.DeleteAsync(conn, type, id);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting lists");
            return new StatusCodeResult(500);
        }
    }
}

