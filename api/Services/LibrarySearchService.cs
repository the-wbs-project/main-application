using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;
using Microsoft.Data.SqlClient;
using Wbs.Api.Configuration;
using Wbs.Api.DataServices;
using Wbs.Api.Models.Search;

namespace Wbs.Api.Services;

public class LibrarySearchService
{
    private readonly string sqlConnectionString;
    private readonly AzureAiSearchConfig config;
    private readonly ILogger<LibrarySearchService> logger;
    private readonly ResourcesDataService resourceDataService;
    private readonly UserDataService userDataService;
    private readonly ListDataService listDataService;
    private readonly OrganizationDataService organizationDataService;
    private readonly LibraryEntryDataService libraryEntryDataService;
    private readonly LibraryEntryNodeDataService libraryEntryNodeDataService;

    public LibrarySearchService(AppConfig config, ILogger<LibrarySearchService> logger, ListDataService listDataService, UserDataService userDataService, OrganizationDataService organizationDataService, ResourcesDataService resourceDataService, LibraryEntryDataService libraryEntryDataService, LibraryEntryNodeDataService libraryEntryNodeDataService)
    {
        this.sqlConnectionString = config.Database.SqlConnectionString;
        this.logger = logger;
        this.config = config.SearchAi;
        this.listDataService = listDataService;
        this.userDataService = userDataService;
        this.resourceDataService = resourceDataService;
        this.organizationDataService = organizationDataService;
        this.libraryEntryDataService = libraryEntryDataService;
        this.libraryEntryNodeDataService = libraryEntryNodeDataService;
    }

    public async Task<SearchResults<LibrarySearchDocument>> RunQueryAsync(string owner, LibraryFilters filters)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = filters.ToFilterString(owner)
        };

        // Enter Hotel property names into this list so only these values will be returned.
        // If Select is empty, all values will be returned, which can be inefficient.
        //options.Select.Add("HotelName");
        //options.Select.Add("Description");

        // For efficiency, the search call should be asynchronous, so use SearchAsync rather than Search.
        return await searchClient.SearchAsync<LibrarySearchDocument>(filters.searchText, options);
    }

    public async Task PushToSearchAsync(string owner, string entryId)
    {
        using (var conn = new SqlConnection(sqlConnectionString))
        {
            await conn.OpenAsync();

            var resourceObj = await resourceDataService.GetAllAsync(conn, "en-US");
            var entry = await libraryEntryDataService.GetViewModelByIdAsync(conn, owner, entryId);
            var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
            var entryTasks = await libraryEntryNodeDataService.GetListAsync(conn, entryId, entry.Version);

            var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
            var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
            var resources = new Resources(resourceObj);

            await VerifyIndexAsync(indexClient);

            var doc = new LibrarySearchDocument
            {
                EntryId = entry.EntryId,
                Version = entry.Version,
                OwnerId = entry.OwnerId,
                OwnerName = (await organizationDataService.GetOrganizationByNameAsync(entry.OwnerId))?.DisplayName,
                AuthorId = entry.Author,
                AuthorName = (await userDataService.GetUserAsync(entry.Author))?.Name,
                Title_En = entry.Title,
                Description_En = entry.Description,
                TypeId = entry.Type,
                TypeName = GetEntryTypeLabel(entry.Type, resources),
                LastModified = entry.LastModified,
                StatusId = entry.Status,
                Visibility = entry.Visibility,
                Tags = new string[] { }
            };

            var tasks = new List<TaskSearchDocument>();

            foreach (var entryTask in entryTasks)
            {
                var task = new TaskSearchDocument
                {
                    TaskId = entryTask.id,
                    Title_En = entryTask.title,
                    Description_En = entryTask.description,
                    CreatedOn = entryTask.createdOn,
                    LastModified = entryTask.lastModified,
                    Tags = new string[] { }
                };

                var disciplines = new List<string>();
                if (entryTask.disciplineIds != null)
                {
                    foreach (var discipline in entryTask.disciplineIds)
                    {
                        disciplines.Add(resources.Get(disciplineLabels[discipline]));
                    }
                }
                task.Disciplines_En = disciplines.ToArray();
                tasks.Add(task);
            }

            doc.Tasks = tasks.ToArray();

            var results = await searchClient.MergeOrUploadDocumentsAsync(
                new List<LibrarySearchDocument> { doc });
        }
    }

    private async Task VerifyIndexAsync(SearchIndexClient indexClient)
    {
        var indexName = config.LibraryIndex;
        try
        {
            var index = await indexClient.GetIndexAsync(indexName);
        }
        catch (RequestFailedException ex)
        {
            if (ex.Status != 404) throw;

            // Create a new search index structure that matches the properties of the Hotel class.
            // The Address class is referenced from the Hotel class. The FieldBuilder
            // will enumerate these to create a complex data structure for the index.
            var builder = new FieldBuilder();
            var definition = new SearchIndex(indexName, builder.Build(typeof(LibrarySearchDocument)));

            await indexClient.CreateIndexAsync(definition);
        }
    }
    private static string GetEntryTypeLabel(string type, Resources resources)
    {
        if (type == "project") return resources.Get("General.Project");
        if (type == "phase") return resources.Get("General.Phase");
        if (type == "task") return resources.Get("General.Task");

        return "";
    }
}
