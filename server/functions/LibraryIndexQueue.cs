using Azure;
using Azure.Search.Documents.Indexes;
using com.sun.tools.@internal.jxc.gen.config;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.Services;
using Wbs.Functions.Services;

namespace functions
{
    public class LibraryIndexQueue
    {
        private readonly ILogger _logger;
        private readonly IDatabaseConfig dbConfig;
        private readonly IAzureAiSearchConfig searchConfig;
        private readonly ListDataService listDataService;
        private readonly LibrarySearchService searchService;
        private readonly LibraryEntryDataService dataService;
        private readonly ResourcesDataService resourceDataService;

        public LibraryIndexQueue(ILoggerFactory loggerFactory, IDatabaseConfig dbConfig, IAzureAiSearchConfig searchConfig, LibrarySearchService searchService, LibraryEntryDataService dataService, ListDataService listDataService, ResourcesDataService resourceDataService)
        {
            _logger = loggerFactory.CreateLogger<LibraryIndexQueue>();
            this.dbConfig = dbConfig;
            this.searchConfig = searchConfig;
            this.dataService = dataService;
            this.searchService = searchService;
            this.listDataService = listDataService;
            this.resourceDataService = resourceDataService;
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
                    var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
                    var resourceObj = await resourceDataService.GetAllAsync(conn, "en-US");
                    var resources = new Resources(resourceObj);
                    var indexClient = new SearchIndexClient(new Uri(searchConfig.Url), new AzureKeyCredential(searchConfig.Key));
                    var searchClient = indexClient.GetSearchClient(searchConfig.LibraryIndex);

                    await searchService.VerifyIndexAsync(indexClient, searchConfig.LibraryIndex);
                    await searchService.PushToSearchAsync(conn, owner, entryId, resources, searchClient, disciplineLabels);
                }
            }
            catch (Exception ex)
            {
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
                    var userCache = new Dictionary<string, UserDocument>();
                    var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
                    var resourceObj = await resourceDataService.GetAllAsync(conn, "en-US");
                    var resources = new Resources(resourceObj); var indexClient = new SearchIndexClient(new Uri(searchConfig.Url), new AzureKeyCredential(searchConfig.Key));
                    var searchClient = indexClient.GetSearchClient(searchConfig.LibraryIndex);

                    await searchService.VerifyIndexAsync(indexClient, searchConfig.LibraryIndex);

                    foreach (var entry in entries)
                    {
                        await searchService.PushToSearchAsync(conn, entry.OwnerId, entry.EntryId, resources, searchClient, disciplineLabels, userCache);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing all library entries by owner " + owner);
                throw;
            }
        }
    }
}
