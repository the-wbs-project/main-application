using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using System.Net;
using System.Text;
using System.Text.Json;

using Wbs.AuthApi.Configurations;

namespace Wbs.AuthApi.Services;

public class Auth0Service
{
    private string mgmtToken;
    private DateTime? expiration;
    private ManagementApiClient client;

    private readonly Auth0Config config;
    private readonly ILogger<Auth0Service> logger;

    public Auth0Service(ILogger<Auth0Service> logger, IConfiguration config)
    {
        this.config = new Auth0Config(config.GetSection("Auth0"));
        this.logger = logger;
    }

    public async Task<User> GetUserAsync(string userId)
    {
        var client = await GetClientAsync();

        return await client.Users.GetAsync(userId);
    }

    public async Task<IEnumerable<Organization>> GetUserOrganizationsAsync(string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        return await client.Users.GetAllOrganizationsAsync(userId, page);
    }

    public async Task<IEnumerable<string>> GetUserSiteRolesAsync(string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        var roles = await client.Users.GetRolesAsync(userId, page);

        return roles.Select(r => r.Name);
    }

    public async Task<IEnumerable<OrganizationMember>> GetOrganizationalUsersAsync(string organization)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        return await client.Organizations.GetAllMembersAsync(organization, page);
    }

    public async Task<IEnumerable<string>> GetUserOrganizationalRolesAsync(string organization, string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        var roles = await client.Organizations.GetAllMemberRolesAsync(organization, userId, page);

        return roles.Select(r => r.Name);
    }

    public async Task AddUserOrganizationalRolesAsync(string organization, string userId, IEnumerable<string> roles)
    {
        var client = await GetClientAsync();

        await client.Organizations.AddMemberRolesAsync(organization, userId, new OrganizationAddMemberRolesRequest { Roles = roles.ToArray() });
    }

    public async Task RemoveUserOrganizationalRolesAsync(string organization, string userId, IEnumerable<string> roles)
    {
        var client = await GetClientAsync();

        await client.Organizations.DeleteMemberRolesAsync(organization, userId, new OrganizationDeleteMemberRolesRequest { Roles = roles.ToArray() });
    }

    public Task RemoveUserFromOrganizationAsync(string organization, string user) => RemoveUserFromOrganizationAsync(organization, new string[] { user });

    public async Task RemoveUserFromOrganizationAsync(string organization, string[] users)
    {
        var client = await GetClientAsync();

        await client.Organizations.DeleteMemberAsync(organization, new OrganizationDeleteMembersRequest { Members = users });
    }

    private async Task<ManagementApiClient> GetClientAsync()
    {
        VerifyToken();

        if (client == null)
        {
            var token = await PullManagementTokenAsync();

            mgmtToken = token.access_token;
            expiration = DateTime.Now.AddSeconds(token.expires_in - 60);

            client = new ManagementApiClient(mgmtToken, new Uri($"https://{config.Domain}/api/v2"));
        }

        return client;
    }

    private void VerifyToken()
    {
        if (expiration == null) return;
        if (expiration < DateTime.Now)
        {
            client = null;
            mgmtToken = null;
            expiration = null;
        }
    }


    private async Task<MgmtTokenResponse> PullManagementTokenAsync()
    {
        var body = new
        {
            client_id = config.ClientId,
            client_secret = config.ClientSecret,
            audience = config.Audience,
            grant_type = "client_credentials"
        };
        using (var client = new HttpClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"),
                RequestUri = new Uri($"https://{config.Domain}/oauth/token")
            };

            var response = await client.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var raw = await response.Content.ReadAsStringAsync(); //.ReadAsAsync<MgmtTokenResponse>();

                return JsonSerializer.Deserialize<MgmtTokenResponse>(raw);
            }
            else
            {
                logger.LogError($"Failed to pull management token: {response.StatusCode}");

                throw new Exception($"Failed to pull management token: {response.StatusCode}");
            }
        }
    }

    private class MgmtTokenResponse
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }
    }

}
