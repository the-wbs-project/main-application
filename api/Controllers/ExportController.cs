using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.Models;
using Wbs.Api.Services.Exporters;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/export")]
public class ExportController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ExportController> logger;
    private readonly ExcelFileExporter xlsxExporter;

    public ExportController(TelemetryClient telemetry, ILogger<ExportController> logger, ExcelFileExporter xlsxExporter)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.xlsxExporter = xlsxExporter;
    }

    [Authorize]
    [HttpPost("xlsx/{culture}")]
    public async Task<IActionResult> Get(string culture, [FromBody] ExportData data)
    {
        try
        {
            var bytes = await xlsxExporter.RunAsync(data.nodes, data.customDisciplines, culture);

            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}
