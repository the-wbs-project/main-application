using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ILogger<ProjectsController> _logger;
    private readonly ProjectDataService dataService;

    public ProjectsController(ILogger<ProjectsController> logger, ProjectDataService dataService)
    {
        _logger = logger;
        this.dataService = dataService;
    }

    [HttpGet("owner/{owner}")]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            return Ok(await dataService.GetByOwnerAsync(owner));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("id/{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        try
        {
            return Ok(await dataService.GetByIdAsync(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(Project project)
    {
        try
        {
            await dataService.SetAsync(project);

            return Accepted();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

