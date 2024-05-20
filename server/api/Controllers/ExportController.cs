using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.Models;
using Wbs.Core.Services.Exporters;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/export")]
public class ExportController : ControllerBase
{
    private readonly ILogger logger;
    private readonly ExcelFileExporter xlsxExporter;

    public ExportController(ILoggerFactory loggerFactory, ExcelFileExporter xlsxExporter)
    {
        logger = loggerFactory.CreateLogger<ExportController>();
        this.xlsxExporter = xlsxExporter;
    }

    [Authorize]
    [HttpPost("xlsx/{culture}")]
    public async Task<IActionResult> Get(string culture, [FromBody] ExportData data)
    {
        try
        {
            var bytes = await xlsxExporter.RunAsync(data.tasks, data.customDisciplines, culture);

            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error exporting data to Excel");
            return new StatusCodeResult(500);
        }
    }
}
