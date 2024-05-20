using Microsoft.Extensions.Logging;
using System.Net;
using System.Text;
using System.Text.Json;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.Services;

public class JiraHelpDeskDataService
{
    protected readonly IJiraHelpDeskConfig config;
    private readonly ILogger<JiraHelpDeskDataService> logger;

    public JiraHelpDeskDataService(ILogger<JiraHelpDeskDataService> logger, IJiraHelpDeskConfig config)
    {
        this.config = config;
        this.logger = logger;
    }

    public async Task<List<JiraOrganization>> GetOrganizationsAsync()
    {
        var response = await GetAsync("organization");

        if (response.StatusCode != HttpStatusCode.OK)
        {
            logger.LogError(
                $"Failed to get organization list: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to get the organization list");
        }
        var results = JsonSerializer.Deserialize<JiraListResponse<JiraOrganization>>(response.Response);

        return results.values.ToList();
    }

    public async Task<List<JiraCustomer>> GetCustomersAsync(string organizationId)
    {
        var response = await GetAsync($"organization/{organizationId}/user");

        if (response.StatusCode != HttpStatusCode.OK)
        {
            logger.LogError(
                $"Failed to get organization list: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to get the organization list");
        }
        var results = JsonSerializer.Deserialize<JiraListResponse<JiraCustomer>>(response.Response);

        return results.values.ToList();
    }

    public async Task AddCustomersAsync(string organizationId, IEnumerable<string> customerIds)
    {
        var response = await PostAsync($"organization/{organizationId}/user", new { accountIds = customerIds });

        if (response.StatusCode != HttpStatusCode.NoContent)
        {
            logger.LogError(
                $"Failed to add customers to organization: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to add customers to the organization");
        }
    }

    public async Task<string> CreateCustomerAsync(string email, string displayName)
    {
        var response = await PostAsync("customer", new { email, displayName });

        if (response.StatusCode == HttpStatusCode.Created)
        {
            var user = JsonSerializer.Deserialize<dynamic>(response.Response);
            return user["accountId"];
        }
        else
        {
            logger.LogError(
                $"Failed to create a customer: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to create the customer");
        }
    }

    public async Task<string> CreateOrganizationAsync(string name)
    {
        var response = await PostAsync("organization", new { name });

        if (response.StatusCode == HttpStatusCode.Created)
        {
            return JsonSerializer.Deserialize<JiraOrganization>(response.Response).id;
        }
        else
        {
            logger.LogError(
                $"Failed to create an organization: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to create the organization");
        }
    }

    public async Task<List<JiraServiceDesk>> GetServiceDesksAsync()
    {
        var response = await GetAsync("servicedesk");

        if (response.StatusCode != HttpStatusCode.OK)
        {
            logger.LogError(
                $"Failed to get service desk list: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to get the service desk list");
        }
        var results = JsonSerializer.Deserialize<JiraListResponse<JiraServiceDesk>>(response.Response);

        return results.values.ToList();
    }

    public async Task AddOrganizationToServiceDeskAsync(string serviceDeskId, string organizationId)
    {
        var response = await PostAsync($"servicedesk/{serviceDeskId}/organization", new { organizationId });

        if (response.StatusCode != HttpStatusCode.NoContent)
        {
            logger.LogError(
                $"Failed to add organization to service desk: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to add organization to the service desk");
        }
    }

    public async Task AddUsersToOrganizationAsync(string organizationId, params string[] accountIds)
    {
        var response = await PostAsync($"organization/{organizationId}/user", new { accountIds });

        if (response.StatusCode != HttpStatusCode.NoContent)
        {
            logger.LogError(
                $"Failed to add users to organization: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to add users to the organization");
        }
    }

    public async Task<List<string>> GetOrganizationsInServiceDeskAsync(string deskId)
    {
        var response = await GetAsync($"servicedesk/{deskId}/organization");

        if (response.StatusCode != HttpStatusCode.OK)
        {
            logger.LogError(
                $"Failed to get organizations in service desk: {response.StatusCode}",
                JsonSerializer.Deserialize<object>(response.Response));

            throw new Exception("Failed to get the organizations in the service desk");
        }
        return JsonSerializer.Deserialize<JiraListResponse<JiraOrganization>>(response.Response).values
            .Select(o => o.id)
            .ToList();
    }

    private async Task<JiraResult> GetAsync(string urlSuffix)
    {
        using (var client = new HttpClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://{config.Domain}/rest/servicedeskapi/{urlSuffix}"),
            };

            request.Headers.Add("Authorization", $"Basic {config.AccessToken}");
            request.Headers.Add("Accept", "application/json");

            var response = await client.SendAsync(request);

            return new JiraResult
            {
                StatusCode = response.StatusCode,
                Response = await response.Content.ReadAsStringAsync()
            };
        }
    }

    private async Task<JiraResult> PostAsync(string urlSuffix, dynamic body)
    {
        using (var client = new HttpClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"),
                RequestUri = new Uri($"https://{config.Domain}/rest/servicedeskapi/" + urlSuffix),
            };

            request.Headers.Add("Authorization", $"Basic {config.AccessToken}");
            request.Headers.Add("Accept", "application/json");

            var response = await client.SendAsync(request);

            return new JiraResult
            {
                StatusCode = response.StatusCode,
                Response = await response.Content.ReadAsStringAsync()
            };
        }
    }

    private class JiraResult
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Response { get; set; }
    }
}
