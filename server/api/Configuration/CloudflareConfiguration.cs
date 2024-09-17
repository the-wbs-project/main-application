using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class CloudflareConfiguration : ICloudflareConfiguration
{
  public CloudflareConfiguration() { }

  public CloudflareConfiguration(IConfiguration config)
  {
    if (config == null) return;

    AccountId = config["Cloudflare:AccountId"]?.Trim();
    ZoneId = config["Cloudflare:ZoneId"]?.Trim();
    Key = config["Cloudflare:Key"]?.Trim();
    KVNamespace = config["Cloudflare:KVNamespace"]?.Trim();
  }

  public string AccountId { get; private set; }
  public string Key { get; private set; }
  public string ZoneId { get; private set; }
  public string KVNamespace { get; private set; }
}
