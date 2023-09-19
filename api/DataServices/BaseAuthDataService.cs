using Auth0.ManagementApi;
using System.Net;
using System.Text;
using System.Text.Json;
using Wbs.Api.Configurations;

namespace Wbs.Api.Services;

public abstract class BaseAuthDataService
{
    protected string mgmtToken;
    protected DateTime? expiration;
    protected ManagementApiClient client;
    protected readonly Auth0Config config;
    private readonly ILogger logger;

    public BaseAuthDataService(ILogger logger, IConfiguration config)
    {
        this.config = new Auth0Config(config.GetSection("Auth0"));
        this.logger = logger;
    }

    protected async Task<ManagementApiClient> GetClientAsync()
    {
        VerifyToken();

        if (client == null)
        {
            var token = await PullManagementTokenAsync();

            mgmtToken = token.access_token;
            expiration = DateTime.Now.AddHours(12);

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
