using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models.Search;

namespace Wbs.Core.Services.Search;

public class UserOrganizationSearchService
{
    private readonly ILogger logger;
    private readonly IAzureAiSearchConfig config;

    public UserOrganizationSearchService(IAzureAiSearchConfig config, ILoggerFactory loggerFactory)
    {
        this.config = config;
        logger = loggerFactory.CreateLogger<UserOrganizationSearchService>();
    }

    public async Task<UserOrganizationDocument> GetAsync(string organizationName, string user, string visibility)
    {
        var id = UserOrganizationDocument.CreateId(organizationName, user, visibility);
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.UserIndex);

        var response = await searchClient.GetDocumentAsync<UserOrganizationDocument>(id);

        return response.Value;
    }

    public async Task<List<UserOrganizationDocument>> GetAllForOrganizationAsync(string organizationName)
    {
        var indexClient = new SearchIndexClient(new Uri(config.Url), new AzureKeyCredential(config.Key));
        var searchClient = indexClient.GetSearchClient(config.LibraryIndex);
        var options = new SearchOptions()
        {
            OrderBy = { "FullName asc" },
            Filter = $"OrgName eq '{organizationName}' and Visibility eq 'organization'",
        };

        var results = await searchClient.SearchAsync<UserOrganizationDocument>(null, options);
        var items = new List<UserOrganizationDocument>();

        foreach (var x in results.Value.GetResults())
        {
            items.Add(x.Document);
        }
        return items;
    }
}
