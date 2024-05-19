using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly DbService db;
    private readonly ILogger logger;
    private readonly ResourcesDataService dataService;

    public ResourcesController(ILoggerFactory loggerFactory, ResourcesDataService dataService, DbService db)
    {
        logger = loggerFactory.CreateLogger<ResourcesController>();
        this.dataService = dataService;
        this.db = db;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string[]>>> GetCategories()
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetCategoriesAsync(conn));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving resources");
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("all/{locale}")] //, Name = "Resources-GetAll")]
    public async Task<IActionResult> GetAll(string locale)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetAllAsync(conn, locale));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving resources");
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("bySection/{section}/{locale}")] //, Name = "Resources-GetBySection")]
    public async Task<IActionResult> GetBySection(string section, string locale)
    {
        try
        {
            logger.LogInformation($"GetBySection: {section}, {locale}");

            using (var conn = await db.CreateConnectionAsync())
                return Ok(await dataService.GetBySectionAsync(conn, locale, section));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving resources");
            return new StatusCodeResult(500);
        }
    }

    [HttpPut(Name = "Resources-Put")]
    public async Task<IActionResult> Put(ResourceObject resource)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
                await dataService.SetAsync(conn, resource.locale, resource.section, resource.values); ;

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving resources");
            return new StatusCodeResult(500);
        }
    }
}

