using Auth0.ManagementApi;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text;
using System.Text.Json;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public abstract class BaseAuthDataService
{
    private string mgmtToken;
    private DateTime? expiration;
    private ManagementApiClient client;
    protected readonly IAuth0Config config;
    protected readonly ILogger logger;

    public BaseAuthDataService(ILogger logger, IAuth0Config config)
    {
        this.config = config;
        this.logger = logger;
    }

    protected async Task<ManagementApiClient> GetClientAsync()
    {
        VerifyToken();

        if (client == null)
        {
            var token = await GetToken();

            client = new ManagementApiClient(token, new Uri($"https://{config.Domain}/api/v2"));
        }

        return client;
    }

    protected async Task<string> GetToken()
    {
        VerifyToken();

        if (mgmtToken != null) return mgmtToken;

        var token = await PullManagementTokenAsync();
        mgmtToken = token.access_token;
        expiration = DateTime.Now.AddMinutes(15);

        return mgmtToken;
    }

    private void VerifyToken()
    {
        if (expiration == null) return;
        if (expiration > DateTime.Now) return;
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
            client_id = config.M2MClientId,
            client_secret = config.M2MClientSecret,
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
