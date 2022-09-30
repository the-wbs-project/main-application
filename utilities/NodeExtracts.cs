using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Utf8Json;
using Wbs.Utilities.Models;
using Wbs.Utilities.Services;

namespace Wbs.Utilities
{
    public class NodeExtracts
    {
        private readonly TelemetryClient telemetry;
        private readonly PhaseExtractService phaseExtractService;
        
        public NodeExtracts(TelemetryConfiguration telemetryConfiguration, PhaseExtractService phaseExtractService)
        {
            telemetry = new TelemetryClient(telemetryConfiguration);
            this.phaseExtractService = phaseExtractService;
        }

        [FunctionName("NodeExtracts-PhaseDownload")]
        public async Task<IActionResult> RunPhaseDownload([HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects/extracts/phase/download")] HttpRequest req, ILogger log)
        {
            try
            {
                var culture = req.Headers["app-culture"];
                var text = await req.ReadAsStringAsync();
                var nodes = JsonSerializer.Deserialize<List<WbsPhaseView>>(text);
                var bytes = await phaseExtractService.DownloadAsync(nodes, culture);

                return new FileContentResult(bytes, "application/vnd.ms-excel");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
                telemetry.TrackException(ex);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("NodeExtracts-PhaseUpload")]
        public async Task<IActionResult> RunPhaseUpload([HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects/extracts/phase/upload")] HttpRequest req, ILogger log)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await req.Body.CopyToAsync(stream);

                    var culture = req.Headers["app-culture"];
                    var data = await phaseExtractService.UploadAsync(stream, culture);

                    return new JsonResult(data);
                }
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
