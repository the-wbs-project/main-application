using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Search;

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
            Select = { "EntryId", "Version", "OwnerId", "OwnerName", "Title_En", "TypeId", "LastModified", "Visibility", "Author", "Disciplines_En", "StatusId" },
            OrderBy = { "LastModified desc" }
        };

        var results = await searchClient.SearchAsync<LibrarySearchDocument>(filters.searchText, options);
        var viewModels = new List<ApiSearchResult<LibraryEntryViewModel>>();

        foreach (var x in results.Value.GetResults())
        {
            var doc = x.Document;
            viewModels.Add(new ApiSearchResult<LibraryEntryViewModel>
            {
                Document = LibraryEntryViewModelTransformer.ToViewModel(doc),
                Highlights = x.Highlights,
                Score = x.Score,
                SemanticSearch = x.SemanticSearch
            });
        }
        return viewModels;
    }

    public async Task<List<LibrarySearchDocument>> GetAllAsync(string owner)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var options = new SearchOptions()
        {
            Filter = $"OwnerId eq '{owner}'"
        };

        var results = await searchClient.SearchAsync<LibrarySearchDocument>(null, options);
        var items = new List<LibrarySearchDocument>();

        foreach (var x in results.Value.GetResults())
        {
            items.Add(x.Document);
        }
        return items;
    }

}
