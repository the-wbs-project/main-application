using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
    private readonly ILogger<ListsController> _logger;
    private readonly ListDataService dataService;

    public ListsController(ILogger<ListsController> logger, ListDataService dataService)
    {
        _logger = logger;
        this.dataService = dataService;
    }

    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            return Ok(await dataService.GetAsync(type));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ListItem resource)
    {
        try
        {
            await dataService.SetAsync(resource);

            return Accepted();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [HttpDelete("{type}/{id}")]
    [IgnoreAntiforgeryToken(Order = 1001)]
    public async Task<IActionResult> Delete(string type, string id)
    {
        try
        {
            await dataService.DeleteAsync(type, id);

            return Accepted();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

