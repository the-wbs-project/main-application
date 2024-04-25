using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services;

public class LibrarySearchService
{
    private readonly ILogger logger;
    private readonly IAzureAiSearchConfig config;

    public LibrarySearchService(IAzureAiSearchConfig config, ILoggerFactory loggerFactory)
    {
        this.config = config;
        logger = loggerFactory.CreateLogger<LibrarySearchService>();
    }

    public async Task<List<ApiSearchResult<LibraryEntryViewModel>>> RunQueryAsync(string owner, LibraryFilters filters)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = filters.ToFilterString(owner),
            Select = { "EntryId", "Version", "OwnerId", "OwnerName", "Title_En", "TypeId", "LastModified", "Visibility", "Author", "Disciplines_En" }
        };

        if (filters.searchText == "")
            options.OrderBy.Add("LastModified desc");

        //throw new Exception(filters.ToFilterString(owner));
        logger.LogError($"Search text: {filters.searchText}");

        // Enter Hotel property names into this list so only these values will be returned.
        // If Select is empty, all values will be returned, which can be inefficient.
        //options.Select.Add("HotelName");
        //options.Select.Add("Description");

        // For efficiency, the search call should be asynchronous, so use SearchAsync rather than Search.
        var results = await searchClient.SearchAsync<LibrarySearchDocument>(filters.searchText, options);
        var viewModels = new List<ApiSearchResult<LibraryEntryViewModel>>();

        foreach (var x in results.Value.GetResults())
        {
            var doc = x.Document;
            viewModels.Add(new ApiSearchResult<LibraryEntryViewModel>
            {
                Document = new LibraryEntryViewModel
                {
                    EntryId = doc.EntryId,
                    AuthorId = doc.Author.Id,
                    AuthorName = doc.Author.Name,
                    Title = doc.Title_En,
                    Description = doc.Description_En,
                    Type = doc.TypeId,
                    LastModified = doc.LastModified,
                    Status = doc.StatusId,
                    OwnerId = doc.OwnerId,
                    OwnerName = doc.OwnerName,
                    Visibility = doc.Visibility,
                    Version = doc.Version
                },
                Highlights = x.Highlights,
                Score = x.Score,
                SemanticSearch = x.SemanticSearch
            });
        }
        return viewModels;
    }
}
