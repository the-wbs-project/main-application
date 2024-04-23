using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using Wbs.Api.Models;
using Wbs.Core.Configuration;
using Wbs.Core.Models.Search;

namespace Wbs.Api.Services;

public class LibrarySearchService
{
    private readonly ILogger logger;
    private readonly IAzureAiSearchConfig config;

    public LibrarySearchService(IAzureAiSearchConfig config, ILoggerFactory loggerFactory)
    {
        this.config = config;
        logger = loggerFactory.CreateLogger<LibrarySearchService>();
    }

    public async Task<SearchResults<LibrarySearchDocument>> RunQueryAsync(string owner, LibraryFilters filters)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = filters.ToFilterString(owner),
            OrderBy = { "LastModified desc" },
        };

        logger.LogInformation($"Search text: {filters.searchText}");

        // Enter Hotel property names into this list so only these values will be returned.
        // If Select is empty, all values will be returned, which can be inefficient.
        //options.Select.Add("HotelName");
        //options.Select.Add("Description");

        // For efficiency, the search call should be asynchronous, so use SearchAsync rather than Search.
        return await searchClient.SearchAsync<LibrarySearchDocument>(filters.searchText, options);
    }
}
