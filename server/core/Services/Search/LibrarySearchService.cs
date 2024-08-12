using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Search;

public class LibrarySearchService
{
    private readonly ILogger logger;
    private readonly IAzureAiSearchConfig config;
    private readonly WatcherLibraryEntryDataService watchDataService;

    public LibrarySearchService(IAzureAiSearchConfig config, ILoggerFactory loggerFactory, WatcherLibraryEntryDataService watchDataService)
    {
        this.config = config;
        this.watchDataService = watchDataService;
        logger = loggerFactory.CreateLogger<LibrarySearchService>();
    }

    public async Task<List<ApiSearchResult<LibraryViewModel>>> RunInternalQueryAsync(SqlConnection conn, string owner, string userId, LibraryFilters filters)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var watchIds = new List<string>();

        if (filters.Roles.Contains("watching"))
        {
            watchIds = (await watchDataService.GetEntriesAsync(conn, userId))
                .Where(x => x.OwnerId == owner)
                .Select(x => x.Id)
                .ToList();
        }

        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = ToInternalFilterString(owner, userId, filters.Types, watchIds),
            //Select = { "EntryId", "PublishedVersion", "VersionTitle_En", "TypeId", "LastModified", "Visibility", "Author", "Disciplines_En", "StatusId" },
            OrderBy = { "LastModified desc" }
        };

        logger.LogWarning($"Search query: {filters.SearchText}");
        logger.LogWarning($"Search filter: {options.Filter}");

        var results = await searchClient.SearchAsync<LibrarySearchDocument>(filters.SearchText, options);
        var viewModels = new List<ApiSearchResult<LibraryViewModel>>();

        foreach (var x in results.Value.GetResults())
        {
            var doc = x.Document;
            viewModels.Add(new ApiSearchResult<LibraryViewModel>
            {
                Document = LibraryViewModelTransformer.ToViewModel(doc),
                Highlights = x.Highlights,
                Score = x.Score,
                SemanticSearch = x.SemanticSearch
            });
        }
        return viewModels;
    }

    public async Task<List<ApiSearchResult<LibraryViewModel>>> RunPublicQueryAsync(SqlConnection conn, string userId, LibraryFilters filters)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var watchIds = new List<string>();

        if (filters.Roles.Contains("watching"))
        {
            watchIds = (await watchDataService.GetEntriesAsync(conn, userId)).Select(x => x.Id).ToList();
        }

        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = ToPublicFilterString(userId, filters.Types, watchIds),
            //Select = { "EntryId", "PublishedVersion", "OwnerId", "OwnerName", "VersionTitle_En", "TypeId", "LastModified", "Visibility", "Author", "Disciplines_En", "StatusId" },
            OrderBy = { "LastModified desc" }
        };

        logger.LogWarning($"Search query: {filters.SearchText}");
        logger.LogWarning($"Search filter: {options.Filter}");

        var results = await searchClient.SearchAsync<LibrarySearchDocument>(filters.SearchText, options);
        var viewModels = new List<ApiSearchResult<LibraryViewModel>>();

        foreach (var x in results.Value.GetResults())
        {
            var doc = x.Document;
            viewModels.Add(new ApiSearchResult<LibraryViewModel>
            {
                Document = LibraryViewModelTransformer.ToViewModel(doc),
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

    public string ToInternalFilterString(string owner, string author, IEnumerable<string> types, IEnumerable<string> watchIds)
    {
        var filterParts = new List<string> { $"(OwnerId eq '{owner}')" };
        //
        //  Associations
        //
        var associations = new List<string>();

        if (author != null)
            associations.Add($"(AuthorId eq '{author}')");

        if (watchIds.Count() > 0)
            associations.Add($"search.in(EntryId, '{string.Join(",", watchIds)}', ',')");

        if (associations.Count > 0)
            filterParts.Add(string.Join(" or ", Wrap(associations)));

        //
        //  Type filter
        //
        if (types != null && types.Count() > 0)
        {
            var typeParts = new List<string>();

            foreach (var type in types)
            {
                typeParts.Add($"TypeId eq '{type}'");
            }
            filterParts.Add(string.Join(" or ", Wrap(typeParts)));
        }
        return string.Join(" and ", Wrap(filterParts));
    }

    public string ToPublicFilterString(string author, IEnumerable<string> types, IEnumerable<string> watchIds)
    {
        var filterParts = new List<string> { "(Visibility eq 'public')" };
        //
        //  Associations
        //
        var associations = new List<string>();

        if (author != null)
            associations.Add($"(AuthorId eq '{author}')");

        if (watchIds.Count() > 0)
            associations.Add($"search.in(EntryId, '{string.Join(",", watchIds)}', ',')");

        if (associations.Count > 0)
            filterParts.Add(string.Join(" or ", Wrap(associations)));

        //
        //  Type filter
        //
        if (types != null && types.Count() > 0)
        {
            var typeParts = new List<string>();

            foreach (var type in types)
            {
                typeParts.Add($"TypeId eq '{type}'");
            }
            filterParts.Add(string.Join(" or ", Wrap(typeParts)));
        }
        return string.Join(" and ", Wrap(filterParts));
    }

    private string[] Wrap(List<string> parts)
    {
        return parts.Select(x => $"({x})").ToArray();
    }
}
