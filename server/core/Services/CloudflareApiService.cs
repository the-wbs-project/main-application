
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;

namespace Wbs.Core.Services;

public class CloudflareApiService
{
    private readonly ILogger logger;
    private readonly string baseAccountUrl;
    private readonly string baseZoneUrl;
    private readonly string baseKvNamespaceUrl;
    private readonly ICloudflareConfiguration config;

    public CloudflareApiService(ILoggerFactory loggerFactory, ICloudflareConfiguration config)
    {
        this.config = config;
        logger = loggerFactory.CreateLogger<CloudflareApiService>();

        if (!isActivated()) return;

        baseAccountUrl = $"https://api.cloudflare.com/client/v4/accounts/{config.AccountId}";
        baseZoneUrl = $"https://api.cloudflare.com/client/v4/zones/{config.ZoneId}";
        baseKvNamespaceUrl = $"{baseAccountUrl}/storage/kv/namespaces/{config.KVNamespace}";
    }

    private bool isActivated() => config.AccountId != null;

    public async Task ClearCacheAsync()
    {
        try
        {
            //curl --request POST --url "https://api.cloudflare.com/client/v4/zones/586d8bc205ce5079b6b4472d45d502ce/purge_cache" -H "Authorization: Bearer b3rGFhojr_KREDf9sLa4mxjwXnAFg38NByvyVbTk" -H "Content-Type: application/json" --data '{"purge_everything":true}'

            using (var client = new HttpClient())
            {
                var request = GetRequest(baseZoneUrl, "purge_cache", HttpMethod.Post, "{\"purge_everything\":true}");
                var response = await client.SendAsync(request);

                await HandleResponse<object>(response);
            }
        }
        catch (Exception e)
        {
            logger.LogWarning($"An error occured trying to clear cache.");
            logger.LogWarning(e.Message);
            throw;
        }
    }

    public async Task<List<string>> GetKvNamespaceKeysAsync()
    {
        if (!isActivated()) return new List<string>();

        try
        {
            //GET https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys

            using (var client = new HttpClient())
            {
                var request = GetRequest(baseKvNamespaceUrl, config.KVNamespace + "/keys", HttpMethod.Get);
                var response = await client.SendAsync(request);

                var keys = await HandleResponse<CloudFlareKVNamespaceKey[]>(response);

                return keys.Select(x => x.Name).ToList();
            }
        }
        catch (Exception e)
        {
            logger.LogWarning($"An error occured trying to clear cache.");
            logger.LogWarning(e.Message);
            throw;
        }
    }

    public async Task SetKvNamespaceValueAsync(string key, object value)
    {
        try
        {
            if (!isActivated()) return;

            //GET https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys

            using (var client = new HttpClient())
            {
                var request = GetRequest(baseKvNamespaceUrl, "values/" + key, HttpMethod.Put, value);
                var response = await client.SendAsync(request);

                await HandleResponse<object>(response);
            }
        }
        catch (Exception e)
        {
            logger.LogWarning($"An error occured trying to set KV value.");
            logger.LogWarning(e.Message);
            throw;
        }
    }

    public async Task DeleteKvNamespaceValueAsync(string key)
    {
        try
        {
            //DELETE https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}

            if (!isActivated()) return;

            using (var client = new HttpClient())
            {
                var request = GetRequest(baseKvNamespaceUrl, "values/" + key, HttpMethod.Delete);
                var response = await client.SendAsync(request);

                await HandleResponse<object>(response);
            }
        }
        catch (Exception e)
        {
            logger.LogWarning($"An error occured trying to delete KV value.");
            logger.LogWarning(e.Message);
            throw;
        }
    }

    private HttpRequestMessage GetRequest(string urlPrefix, string urlSuffix, HttpMethod method, object body = null)
    {
        var request = new HttpRequestMessage(method, string.IsNullOrEmpty(urlSuffix) ? urlPrefix : Path.Combine(urlPrefix, urlSuffix));

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", config.Key);

        if (body != null)
            request.Content = new StringContent(body is string ? (string)body : JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        return request;
    }

    private async Task<T> HandleResponse<T>(HttpResponseMessage response) where T : class
    {
        var raw = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CloudFlareResponse<T>>(raw);

        if (!response.IsSuccessStatusCode || !result.Success)
        {
            logger.LogError("An error occured trying to call the Cloudflare API ({0}).", response.StatusCode);
            logger.LogError(raw);

            throw new Exception("Cloudflare API Error");
        }

        return result.Result;
    }

    private class CloudFlareResponse<T>
    {
        public bool Success { get; set; }
        public List<CloudFlareError> Errors { get; set; }
        public List<CloudFlareError> Messages { get; set; }
        public T Result { get; set; }
    }

    private class CloudFlareError
    {
        public string Code { get; set; }
        public string Message { get; set; }
    }

    private class CloudFlareKVNamespaceKey
    {
        public string Name { get; set; }
        public string Expiration { get; set; }
        public Dictionary<string, string> Metadata { get; set; }
    }
}
