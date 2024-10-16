using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public ResourcesController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ResourcesController>();
        this.data = data;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string[]>>> GetCategories()
    {
        try
        {
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Resources.GetCategoriesAsync(conn));
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
            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Resources.GetAllAsync(conn, locale));
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

            using (var conn = await data.CreateConnectionAsync())
                return Ok(await data.Resources.GetBySectionAsync(conn, locale, section));
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
            using (var conn = await data.CreateConnectionAsync())
                await data.Resources.SetAsync(conn, resource.locale, resource.section, resource.values); ;

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving resources");
            return new StatusCodeResult(500);
        }
    }
}

