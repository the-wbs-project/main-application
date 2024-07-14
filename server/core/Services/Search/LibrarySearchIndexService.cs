using Azure;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Search;

public class LibrarySearchIndexService
{
    private readonly IAzureAiSearchConfig searchConfig;
    private readonly UserDataService userDataService;
    private readonly OrganizationDataService organizationDataService;
    private readonly LibraryEntryDataService libraryEntryDataService;
    private readonly LibraryEntryNodeDataService libraryEntryNodeDataService;
    private readonly LibraryEntryVersionDataService libraryEntryVersionDataService;
    private readonly WatcherLibraryEntryDataService watcherDataService;
    private readonly ResourcesDataService resourcesDataService;
    private readonly ListDataService listDataService;
    private readonly QueueService queueService;

    public LibrarySearchIndexService(IAzureAiSearchConfig searchConfig, UserDataService userDataService, OrganizationDataService organizationDataService, LibraryEntryDataService libraryEntryDataService, LibraryEntryNodeDataService libraryEntryNodeDataService, LibraryEntryVersionDataService libraryEntryVersionDataService, WatcherLibraryEntryDataService watcherDataService, ResourcesDataService resourcesDataService, ListDataService listDataService, QueueService queueService)
    {
        this.searchConfig = searchConfig;
        this.userDataService = userDataService;
        this.organizationDataService = organizationDataService;
        this.libraryEntryDataService = libraryEntryDataService;
        this.libraryEntryNodeDataService = libraryEntryNodeDataService;
        this.libraryEntryVersionDataService = libraryEntryVersionDataService;
        this.watcherDataService = watcherDataService;
        this.resourcesDataService = resourcesDataService;
        this.listDataService = listDataService;
        this.queueService = queueService;
    }

    public void AddToLibraryQueue(string owner, string id)
    {
        queueService.Add("search-library-item", $"{owner}|{id}");
    }

    public async Task RemoveAsync(IEnumerable<LibrarySearchDocument> docs)
    {
        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .DeleteDocumentsAsync(docs);
    }

    public async Task PushToSearchAsync(SqlConnection conn, string owner, string[] entryIds)
    {
        var userCache = new Dictionary<string, UserDocument>();
        var resourceObj = await resourcesDataService.GetAllAsync(conn, "en-US");
        var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
        var resources = new Resources(resourceObj);
        var pushes = new List<Task>();
        //
        //  Get discipline labels
        //
        foreach (var discipline in disciplineLabels.Keys)
            disciplineLabels[discipline] = resources.Get(disciplineLabels[discipline]);

        foreach (var entryId in entryIds)
        {
            var entry = await libraryEntryDataService.GetViewModelByIdAsync(conn, owner, entryId);
            var version = await libraryEntryVersionDataService.GetByIdAsync(conn, entryId, entry.Version);
            var entryTasks = await libraryEntryNodeDataService.GetListAsync(conn, entryId, entry.Version);
            var watcherIds = await watcherDataService.GetUsersAsync(conn, owner, entryId);

            pushes.Add(PushToSearchAsync(resources, entry, version, entryTasks, watcherIds, disciplineLabels, userCache));

            if (pushes.Count > 0)
            {
                await Task.WhenAll(pushes);
                pushes.Clear();
            }
        }
        if (pushes.Count > 0) await Task.WhenAll(pushes);
    }

    public async Task PushToSearchAsync(
        Resources resources,
        LibraryEntryViewModel entry,
        LibraryEntryVersion version,
        IEnumerable<LibraryEntryNode> entryTasks,
        IEnumerable<string> watcherIds,
        Dictionary<string, string> disciplineLabels,
        Dictionary<string, UserDocument> userCache = null)
    {
        var owner = await organizationDataService.GetOrganizationByNameAsync(entry.OwnerId);
        var users = await userDataService.GetUserDocumentsAsync(watcherIds.Concat([entry.AuthorId]).Distinct(), userCache);
        var typeLabel = GetEntryTypeLabel(entry.Type, resources);
        var disciplines = new List<string>();

        foreach (var discipline in version.disciplines)
            disciplines.Add(discipline.isCustom ? discipline.label : disciplineLabels[discipline.id]);

        var toUpload = new List<LibrarySearchDocument>
        {
            LibrarySearchTransformer.CreateDocument("private", entry, owner, typeLabel, watcherIds, entryTasks, disciplines, users)
        };

        if (entry.Visibility == "public")
        {
            toUpload.Add(LibrarySearchTransformer.CreateDocument("public", entry, owner, typeLabel, watcherIds, entryTasks, disciplines, users));
        }
        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .MergeOrUploadDocumentsAsync(toUpload);
    }

    public async Task VerifyIndexAsync()
    {
        var indexName = searchConfig.LibraryIndex;
        var indexClient = GetIndexClient();
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

    private SearchIndexClient GetIndexClient()
    {
        return new SearchIndexClient(new Uri(searchConfig.Url), new AzureKeyCredential(searchConfig.Key));
    }
}
