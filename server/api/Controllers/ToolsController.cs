using Microsoft.AspNetCore.Mvc;
using Wbs.Core.Services.Search;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToolsController : ControllerBase
{
    private readonly ILogger logger;
    private readonly LibrarySearchToolService service;

    public ToolsController(ILoggerFactory loggerFactory, LibrarySearchToolService service)
    {
        logger = loggerFactory.CreateLogger<ToolsController>();
        this.service = service;
    }

    [HttpGet("rebuild")]
    public async Task<ActionResult> Rebuild()
    {
        try
        {
            await service.RebuildAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error rebuilding tools");
            return new StatusCodeResult(500);
        }
    }

    [HttpGet("rebuild/{organization}")]
    public async Task<ActionResult> RebuildOrganization(string organization)
    {
        try
        {
            await service.RebuildAsync(organization);

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error rebuilding tools");
            return new StatusCodeResult(500);
        }
    }
}

