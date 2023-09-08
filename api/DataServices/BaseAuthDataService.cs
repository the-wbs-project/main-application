using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Text;
using System.Text.Json;
using Wbs.Api.Configurations;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public abstract class BaseAuthDataService
{
    protected string mgmtToken;
    protected DateTime? expiration;
    protected ManagementApiClient client;
    protected Dictionary<string, string> roles = new Dictionary<string, string>();

    protected readonly Auth0Config config;
    private readonly ILogger logger;

    public BaseAuthDataService(ILogger logger, IConfiguration config)
    {
        this.config = new Auth0Config(config.GetSection("Auth0"));
        this.logger = logger;
    }

    protected async Task EnsureRolesAsync()
    {
        if (roles.Count > 0) return;

        var client = await GetClientAsync();

        foreach (var role in await client.Roles.GetAllAsync(new GetRolesRequest()))
        {
            if (roles.ContainsKey(role.Name))
                roles[role.Name] = role.Id;
            else
                roles.Add(role.Name, role.Id);
        }
    }

    protected async Task<ManagementApiClient> GetClientAsync()
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
