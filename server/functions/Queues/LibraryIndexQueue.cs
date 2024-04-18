using Microsoft.ApplicationInsights;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Services;

namespace functions
{
    public class LibraryIndexQueue
    {
        private readonly TelemetryClient telemetry;
        private readonly ILogger<LibraryIndexQueue> _logger;
        private readonly IDatabaseConfig dbConfig;
        private readonly LibrarySearchService searchService;
        private readonly LibraryEntryDataService dataService;

        public LibraryIndexQueue(TelemetryClient telemetry, ILogger<LibraryIndexQueue> logger, IDatabaseConfig dbConfig, LibrarySearchService searchService, LibraryEntryDataService dataService)
        {
            _logger = logger;
            this.telemetry = telemetry;
            this.dbConfig = dbConfig;
            this.dataService = dataService;
            this.searchService = searchService;
        }

        [Function("LibraryIndex-Item")]
        public async Task RunItem([QueueTrigger("search-library-item", Connection = "")] string message)
        {
            try
            {
                using (var conn = new SqlConnection(dbConfig.SqlConnectionString))
                {
                    await conn.OpenAsync();

                    var parts = message.Split('|');
                    var owner = parts[0];
                    var entryId = parts[1];

                    await searchService.PushToSearchAsync(conn, owner, entryId);
                }
            }
            catch (Exception ex)
            {
                telemetry.TrackException(ex);
                telemetry.Flush();
                _logger.LogInformation("HELLO WORLD");
                _logger.LogError(ex, "Error processing library entry");
                throw;
            }
        }

        [Function("LibraryIndex-Owner")]
        public async Task RunOrg([QueueTrigger("search-library-owner", Connection = "")] string owner)
        {
            try
            {
                using (var conn = new SqlConnection(dbConfig.SqlConnectionString))
                {
                    await conn.OpenAsync();

                    var entries = await dataService.GetByOwnerAsync(conn, owner);

                    foreach (var entry in entries)
                    {
                        await searchService.PushToSearchAsync(conn, owner, entry.EntryId);
                    }
                }
            }
            catch (Exception ex)
            {
                telemetry.TrackException(ex);
                _logger.LogError(ex, "Error processing all library entries by owner " + owner);
                throw;
            }
        }
    }
}
