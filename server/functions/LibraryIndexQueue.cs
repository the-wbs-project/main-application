using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Search;

namespace functions
{
    public class LibraryIndexQueue
    {
        private readonly DbService db;
        private readonly ILogger _logger;
        private readonly LibrarySearchIndexService searchIndexService;
        private readonly LibraryEntryDataService dataService;
        private readonly LibraryEntryViewDataService entryViewDataService;
        private readonly LibrarySearchService searchSearch;

        public LibraryIndexQueue(ILoggerFactory loggerFactory, LibrarySearchIndexService searchIndexService, LibraryEntryDataService dataService, DbService db, LibrarySearchService searchSearch, LibraryEntryViewDataService entryViewDataService)
        {
            _logger = loggerFactory.CreateLogger<LibraryIndexQueue>();
            this.dataService = dataService;
            this.searchIndexService = searchIndexService;
            this.db = db;
            this.searchSearch = searchSearch;
            this.entryViewDataService = entryViewDataService;
        }

        [Function("LibraryIndex-Build")]
        public async Task RunBuild([QueueTrigger("search-library-build", Connection = "")] string message)
        {
            try
            {
                await searchIndexService.VerifyIndexAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing library entry");
                throw;
            }
        }


        [Function("LibraryIndex-Item")]
        public async Task RunItem([QueueTrigger("search-library-item", Connection = "")] string message)
        {
            try
            {
                using (var conn = await db.CreateConnectionAsync())
                {
                    var parts = message.Split('|');
                    var owner = parts[0];
                    var entryId = parts[1];
                    await searchIndexService.VerifyIndexAsync();
                    await searchIndexService.PushToSearchAsync(conn, owner, [entryId]);
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
                using (var conn = await db.CreateConnectionAsync())
                {
                    var entries = await entryViewDataService.GetAllAsync(conn, owner);

                    await searchIndexService.VerifyIndexAsync();
                    await searchIndexService.PushToSearchAsync(conn, owner, entries.Select(e => e.EntryId).ToArray());
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing all library entries by owner " + owner);
                throw;
            }
        }


        [Function("LibraryIndex-Clean")]
        public async Task RunClean([QueueTrigger("search-library-clean", Connection = "")] string owner)
        {
            try
            {
                using (var conn = await db.CreateConnectionAsync())
                {
                    await searchIndexService.VerifyIndexAsync();

                    var entries = await entryViewDataService.GetAllAsync(conn, owner);
                    var search = await searchSearch.GetAllAsync(owner);
                    var toRemove = search
                        .Where(d => !entries.Any(e => e.EntryId == d.EntryId && e.Version == d.Version))
                        .ToList();

                    if (toRemove.Count > 0)
                        await searchIndexService.RemoveAsync(toRemove);
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
