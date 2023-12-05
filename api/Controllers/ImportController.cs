using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Services;
using Wbs.Api.Services.Importers;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ImportController> logger;
    private readonly ProjectFileImporter mppImporter;
    private readonly ExcelFileImporter xlsxImporter;
    private readonly DocumentAiService aiService;
    private readonly Storage storage;

    public ImportController(TelemetryClient telemetry, ILogger<ImportController> logger, ProjectFileImporter mppImporter, ExcelFileImporter xlsxImporter, DocumentAiService aiService, Storage storage)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.mppImporter = mppImporter;
        this.xlsxImporter = xlsxImporter;
        this.aiService = aiService;
        this.storage = storage;
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
            telemetry.TrackException(ex);
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
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("ai/{owner}/{fileName}")]
    public async Task<IActionResult> PostAi(string owner, string fileName)
    {
        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;

            using (var stream = new MemoryStream())
            {
                await Request.Body.CopyToAsync(stream);

                fileName = $"{DateTime.Now:yyyyMMddHHmmss}-${owner}-${fileName}";

                var blob = await storage.SaveFileAsync("ai", fileName, stream.ToArray(), false);

                return Ok(await aiService.GetResultsAsync(owner, blob.Uri.ToString()));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

