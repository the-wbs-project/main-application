using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Services.Importers;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController : ControllerBase
{
    private readonly ILogger<ImportController> _logger;
    private readonly ProjectFileImporter mppImporter;
    private readonly ExcelFileImporter xlsxImporter;

    public ImportController(ILogger<ImportController> logger, ProjectFileImporter mppImporter, ExcelFileImporter xlsxImporter)
    {
        _logger = logger;
        this.mppImporter = mppImporter;
        this.xlsxImporter = xlsxImporter;
    }

    [Authorize]
    [HttpPost("mpp/{culture}")]
    public async Task<ActionResult<Models.ProjectImportResults>> PostMpp(string culture)
    {
        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;

            using (var stream = new MemoryStream())
            {
                await Request.Body.CopyToAsync(stream);

                return Ok(mppImporter.Run(stream.ToArray()));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("xlsx/{culture}")]
    public async Task<IActionResult> PostXlsx(string culture)
    {
        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;

            using (var stream = new MemoryStream())
            {
                await Request.Body.CopyToAsync(stream);

                return Ok(await xlsxImporter.RunAsync(stream, culture));
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return new StatusCodeResult(500);
        }
    }
}

