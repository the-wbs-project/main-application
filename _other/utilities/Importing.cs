using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Wbs.Utilities.DataServices;
using Wbs.Utilities.Services.Importers;

namespace Wbs.Utilities
{
    public class Importing
    {
        private readonly TelemetryClient telemetry;
        private readonly ProjectFileImporter mppImporter;
        private readonly ExcelFileImporter xlsxImporter;
        private readonly Storage storage;

        public Importing(IConfiguration config, ExcelFileImporter xlsxImporter, ProjectFileImporter mppImporter, Storage storage)
        {
            telemetry = new TelemetryClient(new TelemetryConfiguration
            {
                ConnectionString = config["APPLICATIONINSIGHTS_CONNECTION_STRING"]
            });
            this.mppImporter = mppImporter;
            this.xlsxImporter = xlsxImporter;
            this.storage = storage;
        }

        [FunctionName("Importing-ProjectFileTest")]
        public async Task RunProjectFileTest([QueueTrigger("import-mpp")] string fileName, ILogger log)
        {
            var file = await storage.GetFileAsBytesAsync("imports", fileName);
            var results = mppImporter.Run(file);
        }

        [FunctionName("Importing-Mpp")]
        public async Task<IActionResult> RunMpp([HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects/import/mpp")] HttpRequest req, ILogger log)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await req.Body.CopyToAsync(stream);

                    var file = stream.ToArray();
                    var results = mppImporter.Run(file);

                    return new JsonResult(results);
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
                telemetry.TrackException(ex);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("Importing-Xlsx")]
        public async Task<IActionResult> RunXlsx([HttpTrigger(AuthorizationLevel.Function, "post", Route = "projects/import/xlsx")] HttpRequest req, ILogger log)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await req.Body.CopyToAsync(stream);

                    var culture = req.Headers["app-culture"];

                    var results = xlsxImporter.RunAsync(stream, culture);

                    return new JsonResult(results);
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