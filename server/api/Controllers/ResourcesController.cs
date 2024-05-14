using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly ILogger<ResourcesController> logger;
    private readonly ResourcesDataService dataService;

    public ResourcesController(ILoggerFactory loggerFactory, ResourcesDataService dataService)
    {
        logger = loggerFactory.CreateLogger<ResourcesController>();
        this.dataService = dataService;
    }

    [HttpGet("categories")] //,Name = "Resources-GetCategories")]
    public async Task<ActionResult<IEnumerable<string[]>>> GetCategories()
    {
        try
        {
            return Ok(await dataService.GetCategoriesAsync());
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
            return Ok(await dataService.GetAllAsync(locale));
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

            return Ok(await dataService.GetBySectionAsync(locale, section));
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
            await dataService.SetAsync(resource.locale, resource.section, resource.values); ;

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving resources");
            return new StatusCodeResult(500);
        }
    }
}

