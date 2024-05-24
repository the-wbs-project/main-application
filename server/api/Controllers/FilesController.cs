using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly Storage storage;

    public FilesController(ILoggerFactory loggerFactory, Storage storage)
    {
        logger = loggerFactory.CreateLogger<FilesController>();
        this.storage = storage;
    }

    [Authorize]
    [HttpGet("{fileName}")]
    public async Task<IActionResult> Get(string fileName)
    {
        try
        {
            var file = await storage.GetFileAsBytesAsync("templates", fileName);

            return File(file, "application/octet-stream");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving template file");
            return new StatusCodeResult(500);
        }
    }
}

