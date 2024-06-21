using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Wbs.Core.DataServices;
using Wbs.Core.Services.Search;

namespace Wbs.Functions;

public class LibraryIndexQueue
{
    private readonly DbService db;
    private readonly ILogger _logger;
    private readonly LibrarySearchIndexService searchService;
    private readonly LibraryEntryDataService dataService;

    public LibraryIndexQueue(ILoggerFactory loggerFactory, LibrarySearchIndexService searchService, LibraryEntryDataService dataService, DbService db)
    {
        _logger = loggerFactory.CreateLogger<LibraryIndexQueue>();
        this.dataService = dataService;
        this.searchService = searchService;
        this.db = db;
    }

    [Function("LibraryIndex-Build")]
    public async Task RunBuild([QueueTrigger("search-library-build", Connection = "")] string message)
    {
        try
        {
            await searchService.VerifyIndexAsync();
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
                await searchService.VerifyIndexAsync();
                await searchService.PushToSearchAsync(conn, owner, [entryId]);
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
                var entries = await dataService.GetByOwnerAsync(conn, owner);

                await searchService.VerifyIndexAsync();
                await searchService.PushToSearchAsync(conn, owner, entries.Select(e => e.EntryId).ToArray());
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing all library entries by owner " + owner);
            throw;
        }
    }
}
