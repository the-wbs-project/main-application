using Auth0.ManagementApi.Models;
using Azure;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.Services.Search;

public class UserOrganizationIndexService
{
    private readonly IAzureAiSearchConfig searchConfig;
    private readonly UserDataService userDataService;
    private readonly OrganizationDataService organizationDataService;

    public UserOrganizationIndexService(IAzureAiSearchConfig searchConfig, UserDataService userDataService, OrganizationDataService organizationDataService)
    {
        this.searchConfig = searchConfig;
        this.userDataService = userDataService;
        this.organizationDataService = organizationDataService;
    }

    public async Task RemoveAsync(IEnumerable<UserOrganizationDocument> docs)
    {
        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .DeleteDocumentsAsync(docs);
    }

    public async Task PushAsync(IEnumerable<UserOrganizationDocument> docs)
    {
        var results = await GetIndexClient()
            .GetSearchClient(searchConfig.UserIndex)
            .MergeOrUploadDocumentsAsync(docs);
    }

    public async Task<List<UserOrganizationDocument>> BuildDocsAsync(string organizationName)
    {
        var organization = await organizationDataService.GetOrganizationByNameAsync(organizationName);
        var members = await organizationDataService.GetOrganizationalUsersAsync(organization.Id);
        var results = new List<UserOrganizationDocument>();

        foreach (var member in members)
        {
            results.AddRange(await BuildDocsAsync(organization, member.Id));
        }
        return results;
    }

    public async Task<List<UserOrganizationDocument>> BuildDocsAsync(Organization organization, string userId)
    {
        var roles = await userDataService.GetRolesAsync();
        var user = await userDataService.GetUserAsync(userId);
        var userRoles = await organizationDataService.GetUserOrganizationalRolesAsync(organization.Id, userId);
        var userRoles2 = userRoles.Select(r => roles.Single(x => x.Id == r).Name).ToArray();

        return new List<UserOrganizationDocument> {
            UserSearchTransformer.CreateDocument(organization, user, userRoles2, "organization"),
            UserSearchTransformer.CreateDocument(organization, user, userRoles2, "public")
        };
    }

    public async Task VerifyIndexAsync()
    {
        var indexName = searchConfig.UserIndex;
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
            var definition = new SearchIndex(indexName, builder.Build(typeof(UserOrganizationDocument)));

            await indexClient.CreateIndexAsync(definition);
        }
    }

    private static string GetRoleLabel(string type, Resources resources)
    {
        if (type == "pm") return resources.Get("General.PM");
        if (type == "sme") return resources.Get("General.SME");
        if (type == "approver") return resources.Get("General.Approver");

        return "";
    }

    private SearchIndexClient GetIndexClient()
    {
        return new SearchIndexClient(new Uri(searchConfig.Url), new AzureKeyCredential(searchConfig.Key));
    }
}
