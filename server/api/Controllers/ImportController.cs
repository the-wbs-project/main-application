using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Services;
using Wbs.Core.Services.Importers;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController : ControllerBase
{
    private readonly ILogger logger;
    private readonly ProjectFileImporter mppImporter;
    private readonly ExcelFileImporter xlsxImporter;
    private readonly DataServiceFactory data;

    public ImportController(ILoggerFactory loggerFactory, ProjectFileImporter mppImporter, ExcelFileImporter xlsxImporter, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<ImportController>();
        this.mppImporter = mppImporter;
        this.xlsxImporter = xlsxImporter;
        this.data = data;
    }

    [Authorize]
    [HttpPost("mpp/{culture}")]
    public async Task<ActionResult<ProjectImportResults>> PostMpp(string culture)
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
            logger.LogError(ex, "Error processing MPP file");
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
            logger.LogError(ex, "Error processing XLSX file");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPost("rates")]
    public async Task<ActionResult> PostRates()
    {
        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;

            using (var stream = new MemoryStream())
            {
                await Request.Body.CopyToAsync(stream);

                return Ok(mppImporter.GetResources(stream.ToArray()));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing MPP file for rates");
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

                await data.Storage.SaveFileAsync("aistorage", fileName, stream.ToArray());

                var blob = await data.Storage.GetFileAsBytesAsync("aistorage", fileName);

                return Ok(""); //await aiService.GetResultsAsync(owner, blob.Uri.ToString()));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing AI file");
            return new StatusCodeResult(500);
        }
    }
}

