using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.Services;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly UserDataService dataService;

    public RolesController(ILoggerFactory loggerFactory, UserDataService dataService)
    {
        logger = loggerFactory.CreateLogger<RolesController>();
        this.dataService = dataService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRolesAsync()
    {
        try
        {
            return Ok(await dataService.GetRolesAsync());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to get roles");
            return new StatusCodeResult(500);
        }
    }
}

