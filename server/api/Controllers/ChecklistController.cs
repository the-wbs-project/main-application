using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChecklistsController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public ChecklistsController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ChecklistsController>();
        this.data = data;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync()
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Checklists.GetAsync(conn));
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
            using (var conn = await data.CreateConnectionAsync())
            {
                await data.Checklists.SetAsync(conn, groups);

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
