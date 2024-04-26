using System.Text.Json;
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services;

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

    public LibrarySearchIndexService(IAzureAiSearchConfig searchConfig, UserDataService userDataService, OrganizationDataService organizationDataService, LibraryEntryDataService libraryEntryDataService, LibraryEntryNodeDataService libraryEntryNodeDataService, LibraryEntryVersionDataService libraryEntryVersionDataService, WatcherLibraryEntryDataService watcherDataService, ResourcesDataService resourcesDataService, ListDataService listDataService)
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
    }

    public async Task PushToSearchAsync(SqlConnection conn, string owner, string[] entryIds)
    {
        var userCache = new Dictionary<string, UserDocument>();
        var resourceObj = await resourcesDataService.GetAllAsync(conn, "en-US");
        var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
        var resources = new Resources(resourceObj);
        //
        //  Get discipline labels
        //
        foreach (var discipline in disciplineLabels.Keys)
            disciplineLabels[discipline] = resources.Get(disciplineLabels[discipline]);

        foreach (var entryId in entryIds)
        {
            var entry = await libraryEntryDataService.GetViewModelByIdAsync(conn, owner, entryId);

            if (entry == null) continue;

            var version = await libraryEntryVersionDataService.GetByIdAsync(conn, entryId, entry.Version);
            var entryTasks = await libraryEntryNodeDataService.GetListAsync(conn, entryId, entry.Version);
            var watcherIds = await watcherDataService.GetUsersAsync(conn, owner, entryId);

            await PushToSearchAsync(resources, entry, version, entryTasks, watcherIds, disciplineLabels, userCache);
        }
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
        var users = await GetUsersAsync(watcherIds.Concat([entry.AuthorId]).Distinct(), userCache);
        var disciplines = new List<string>();

        foreach (var discipline in version.disciplines)
        {
            var obj = (JsonElement)discipline;

            if (obj.ToString()[0] == '{')
            {
                var label = obj.GetProperty("label").GetString();

                disciplines.Add(label);
            }
            else
            {
                disciplines.Add(disciplineLabels[obj.ToString()]);
            }
        }

        var doc = new LibrarySearchDocument
        {
            EntryId = entry.EntryId,
            Version = entry.Version,
            OwnerId = entry.OwnerId,
            OwnerName = (await organizationDataService.GetOrganizationByNameAsync(entry.OwnerId))?.DisplayName,
            Title_En = entry.Title,
            Description_En = entry.Description,
            TypeId = entry.Type,
            TypeName = GetEntryTypeLabel(entry.Type, resources),
            LastModified = entry.LastModified,
            StatusId = entry.Status,
            Visibility = entry.Visibility,
            Disciplines_En = disciplines.ToArray(),
            //
            //  Users
            //
            Author = users.ContainsKey(entry.AuthorId) ? new SortableUserDocument(users[entry.AuthorId]) : null,
            Watchers = watcherIds
                .Where(x => users.ContainsKey(x))
                .Select(x => users[x])
                .ToArray(),
        };

        var tasks = new List<TaskSearchDocument>();

        foreach (var entryTask in entryTasks)
        {
            tasks.Add(new TaskSearchDocument
            {
                TaskId = entryTask.id,
                Title_En = entryTask.title,
                Description_En = entryTask.description,
            });
        }

        doc.Tasks = tasks.ToArray();

        var results = await GetSearchClient(searchConfig.LibraryIndex).MergeOrUploadDocumentsAsync(
            new List<LibrarySearchDocument> { doc });
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

    private async Task<Dictionary<string, UserDocument>> GetUsersAsync(IEnumerable<string> userIds, Dictionary<string, UserDocument> userCache = null)
    {
        var users = new Dictionary<string, UserDocument>();
        var calls = new List<Task<Member>>();

        foreach (var userId in userIds)
        {
            if (userCache != null && userCache.ContainsKey(userId))
            {
                users.Add(userId, userCache[userId]);
                continue;
            }
            calls.Add(userDataService.GetUserAsync(userId));

            if (calls.Count == 25)
            {
                var results = await Task.WhenAll(calls);

                foreach (var result in results)
                {
                    var model = new UserDocument(result.Id, result.Name);
                    users.Add(result.Id, model);

                    if (userCache != null) userCache.Add(result.Id, model);
                }
                calls.Clear();
            }
        }
        if (calls.Count > 0)
        {
            var results = await Task.WhenAll(calls);

            foreach (var result in results)
            {
                var model = new UserDocument(result.Id, result.Name);
                users.Add(result.Id, model);

                if (userCache != null) userCache.Add(result.Id, model);
            }
        }

        return users;
    }

    private SearchIndexClient GetIndexClient()
    {
        return new SearchIndexClient(new Uri(searchConfig.Url), new AzureKeyCredential(searchConfig.Key));
    }

    private SearchClient GetSearchClient(string indexName)
    {
        return GetIndexClient().GetSearchClient(indexName);
    }
}
