using Auth0.ManagementApi.Models;
using Azure;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.Services.Search;

public class LibrarySearchIndexService
{
    private readonly IAzureAiSearchConfig searchConfig;
    private readonly UserDataService userDataService;
    private readonly OrganizationDataService organizationDataService;
    private readonly LibraryEntryDataService libraryEntryDataService;
    private readonly LibraryEntryVersionDataService libraryEntryVersionDataService;
    private readonly ResourcesDataService resourcesDataService;
    private readonly ListDataService listDataService;

    public LibrarySearchIndexService(IAzureAiSearchConfig searchConfig, UserDataService userDataService, OrganizationDataService organizationDataService, LibraryEntryDataService libraryEntryDataService, LibraryEntryVersionDataService libraryEntryVersionDataService, ResourcesDataService resourcesDataService, ListDataService listDataService)
    {
        this.searchConfig = searchConfig;
        this.userDataService = userDataService;
        this.organizationDataService = organizationDataService;
        this.libraryEntryDataService = libraryEntryDataService;
        this.libraryEntryVersionDataService = libraryEntryVersionDataService;
        this.resourcesDataService = resourcesDataService;
        this.listDataService = listDataService;
    }

    public async Task RemoveAsync(IEnumerable<LibrarySearchDocument> docs)
    {
        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .DeleteDocumentsAsync(docs);
    }

    public async Task PushToSearchAsync(SqlConnection conn, string owner, string[] entryIds)
    {
        var resourceObj = await resourcesDataService.GetAllAsync(conn, "en-US");
        var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
        var resources = new Resources(resourceObj);
        var pushes = new List<Task>();
        var ownerObj = await organizationDataService.GetOrganizationByNameAsync(owner);
        //
        //  Get discipline labels
        //
        foreach (var discipline in disciplineLabels.Keys)
            disciplineLabels[discipline] = resources.Get(disciplineLabels[discipline]);

        foreach (var entryId in entryIds)
        {
            var entry = await libraryEntryDataService.GetByIdAsync(conn, owner, entryId);

            if (entry == null || !entry.PublishedVersion.HasValue) continue;

            var version = await libraryEntryVersionDataService.GetByIdAsync(conn, entryId, entry.PublishedVersion.Value);
            var author = await userDataService.GetMemberAsync(version.Author);

            pushes.Add(PushToSearchAsync(resources, ownerObj, entry, version, author.Name, disciplineLabels));

            if (pushes.Count > 0)
            {
                await Task.WhenAll(pushes);
                pushes.Clear();
            }
        }
        if (pushes.Count > 0) await Task.WhenAll(pushes);
    }

    public async Task PushToSearchAsync(SqlConnection conn, LibraryEntry entry, LibraryEntryVersion version)
    {
        var resourceObj = await resourcesDataService.GetAllAsync(conn, "en-US");
        var disciplineLabels = await listDataService.GetLabelsAsync(conn, "categories_discipline");
        var resources = new Resources(resourceObj);
        var ownerObj = await organizationDataService.GetOrganizationByNameAsync(entry.OwnerId);
        var author = await userDataService.GetMemberAsync(version.Author);
        //
        //  Get discipline labels
        //
        foreach (var discipline in disciplineLabels.Keys)
            disciplineLabels[discipline] = resources.Get(disciplineLabels[discipline]);

        await PushToSearchAsync(resources, ownerObj, entry, version, author.Name, disciplineLabels);
    }

    public async Task PushToSearchAsync(
        Resources resources,
        Organization owner,
        LibraryEntry entry,
        LibraryEntryVersion version,
        string authorName,
        Dictionary<string, string> disciplineLabels)
    {
        var typeLabel = GetEntryTypeLabel(entry.Type, resources);
        var disciplines = new List<string>();

        foreach (var discipline in version.Disciplines)
            disciplines.Add(discipline.isCustom ? discipline.label : disciplineLabels[discipline.id]);

        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .MergeOrUploadDocumentsAsync(new[] { LibrarySearchTransformer.CreateDocument(entry, version, owner, typeLabel, authorName, disciplines) });
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
