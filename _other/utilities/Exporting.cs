using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Utf8Json;
using Wbs.Utilities.Models;
using Wbs.Utilities.Services.Exporters;

namespace Wbs.Utilities
{
    public class Exporting
    {
        private readonly TelemetryClient telemetry;
        private readonly ExcelFileExporter xlsxExporter;
        
        public Exporting(TelemetryConfiguration telemetryConfiguration, ExcelFileExporter xlsxExporter)
        {
            telemetry = new TelemetryClient(telemetryConfiguration);
            this.xlsxExporter = xlsxExporter;
        }

        [FunctionName("NodeExtracts-PhaseDownload")]
        public async Task<IActionResult> RunPhaseDownload([HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects/export/xlsx")] HttpRequest req, ILogger log)
        {
            try
            {
                var culture = req.Headers["app-culture"];
                var text = await req.ReadAsStringAsync();
                var nodes = JsonSerializer.Deserialize<List<WbsPhaseView>>(text);
                var bytes = await xlsxExporter.RunAsync(nodes, culture);

                log.LogDebug("Test");

                return new FileContentResult(bytes, "application/vnd.ms-excel");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
                telemetry.TrackException(ex);
                return new StatusCodeResult(500);
            }
        }
    }
}
