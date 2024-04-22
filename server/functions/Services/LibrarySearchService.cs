using System.Text.Json;
using Azure;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services;

namespace Wbs.Functions.Services;

public class LibrarySearchService
{
    private readonly IAzureAiSearchConfig config;
    private readonly ResourcesDataService resourceDataService;
    private readonly UserDataService userDataService;
    private readonly ListDataService listDataService;
    private readonly OrganizationDataService organizationDataService;
    private readonly LibraryEntryDataService libraryEntryDataService;
    private readonly LibraryEntryNodeDataService libraryEntryNodeDataService;
    private readonly LibraryEntryVersionDataService libraryEntryVersionDataService;
    private readonly WatcherLibraryEntryDataService watcherDataService;

    public LibrarySearchService(IAzureAiSearchConfig config, ListDataService listDataService, UserDataService userDataService, OrganizationDataService organizationDataService, ResourcesDataService resourceDataService, LibraryEntryDataService libraryEntryDataService, LibraryEntryNodeDataService libraryEntryNodeDataService, LibraryEntryVersionDataService libraryEntryVersionDataService, WatcherLibraryEntryDataService watcherDataService)
    {
        this.config = config;
        this.listDataService = listDataService;
        this.userDataService = userDataService;
        this.resourceDataService = resourceDataService;
        this.organizationDataService = organizationDataService;
        this.libraryEntryDataService = libraryEntryDataService;
        this.libraryEntryNodeDataService = libraryEntryNodeDataService;
        this.libraryEntryVersionDataService = libraryEntryVersionDataService;
        this.watcherDataService = watcherDataService;
    }

    public async Task PushToSearchAsync(SqlConnection conn, string owner, string entryId, Dictionary<string, UserDocument> userCache = null)
    {
        var resourceObj = await resourceDataService.GetAllAsync(conn, "en-US");
        var entry = await libraryEntryDataService.GetViewModelByIdAsync(conn, owner, entryId);
        var version = await libraryEntryVersionDataService.GetByIdAsync(conn, entryId, entry.Version);
        var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
        var entryTasks = await libraryEntryNodeDataService.GetListAsync(conn, entryId, entry.Version);
        var watcherIds = await watcherDataService.GetUsersAsync(conn, owner, entryId);

        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var resources = new Resources(resourceObj);
        var users = await GetUsersAsync(watcherIds.Concat([entry.Author]), userCache);
        //
        //  Get discipline labels
        //
        foreach (var discipline in disciplineLabels.Keys)
        {
            disciplineLabels[discipline] = resources.Get(disciplineLabels[discipline]);
        }

        foreach (var discipline in version.disciplines)
        {
            var obj = (JsonElement)discipline;

            if (obj.ToString()[0] == '{')
            {
                var id = obj.GetProperty("id").GetString();
                var label = obj.GetProperty("label").GetString();

                disciplineLabels.Add(id, label);
            }
        }

        await VerifyIndexAsync(indexClient);

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
            Tags = [],
            //
            //  Users
            //
            Author = users.ContainsKey(entry.Author) ? users[entry.Author] : null,
            Watchers = watcherIds.Where(x => users.ContainsKey(x)).Select(x => users[x]).ToArray(),
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
                Tags = []
            };

            var disciplines = new List<string>();
            if (entryTask.disciplineIds != null)
            {
                foreach (var discipline in entryTask.disciplineIds)
                {
                    if (disciplineLabels.ContainsKey(discipline))
                        disciplines.Add(disciplineLabels[discipline]);
                }
            }
            task.Disciplines_En = disciplines.ToArray();
            tasks.Add(task);
        }

        doc.Tasks = tasks.ToArray();

        var results = await searchClient.MergeOrUploadDocumentsAsync(
            new List<LibrarySearchDocument> { doc });
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
}
