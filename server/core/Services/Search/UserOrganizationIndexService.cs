using Auth0.ManagementApi.Models;
using Azure;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;

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

    public async Task PushAllUsersAsync(string organizationId)
    {
        var organization = await organizationDataService.GetOrganizationByNameAsync(organizationId);
        var members = await organizationDataService.GetOrganizationalUsersAsync(organizationId);

        foreach (var member in members)
        {
            await PushAsync(organization, member.Id);
        }
    }

    public async Task PushToSearchAsync(string organizationId, string userId)
    {
        var organization = await organizationDataService.GetOrganizationByNameAsync(organizationId);

        await PushAsync(organization, userId);
    }

    private async Task PushAsync(Organization organization, string userId)
    {
        var roles = await userDataService.GetRolesAsync();
        var user = await userDataService.GetUserAsync(userId);
        var userRoles = await organizationDataService.GetUserOrganizationalRolesAsync(organization.Id, userId);

        await PushAsync(organization, user, userRoles.Select(r => roles.Single(x => x.Id == r).Name).ToArray());
    }

    private async Task PushAsync(Organization organization, User user, string[] roles)
    {
        var orgDoc = new UserOrganizationDocument
        {
            Id = $"{organization.Id}-{user.UserId}-organization",
            UserId = user.UserId,
            OrgId = organization.Id,
            OrgName = organization.Name,
            OrgDisplayName = organization.DisplayName,
            Visibility = "organization",
            FullName = user.FullName,
            Email = user.Email,
            Title = user.UserMetadata.Title,
            Phone = user.UserMetadata.Phone,
            Picture = user.Picture,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            LoginCount = user.LoginsCount,
            Roles = roles,
            LinkedIn = user.UserMetadata.LinkedIn,
            Twitter = user.UserMetadata.Twitter
        };

        string[] showExternally = (user.UserMetadata.ShowExternally ?? "").Split(",");
        var publicDoc = new UserOrganizationDocument
        {
            Id = $"{organization.Id}-{user.UserId}-public",
            UserId = user.UserId,
            OrgId = organization.Id,
            OrgName = organization.Name,
            OrgDisplayName = organization.DisplayName,
            Visibility = "public",
            FullName = user.FullName,
            Picture = user.Picture,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            LoginCount = user.LoginsCount,
            Roles = roles,
            Email = showExternally.Contains("email") ? user.Email : "private",
            Phone = showExternally.Contains("phone") ? user.PhoneNumber : "private",
            Title = showExternally.Contains("title") ? user.UserMetadata.Title : "private",
            LinkedIn = showExternally.Contains("linkedIn") ? user.UserMetadata.LinkedIn : "private",
            Twitter = showExternally.Contains("twitter") ? user.UserMetadata.Twitter : "private",
        };

        var results = await GetIndexClient().GetSearchClient(searchConfig.LibraryIndex)
            .MergeOrUploadDocumentsAsync(new List<UserOrganizationDocument> { orgDoc, publicDoc });
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
