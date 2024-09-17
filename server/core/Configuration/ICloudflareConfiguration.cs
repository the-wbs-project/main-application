namespace Wbs.Core.Configuration;

public interface ICloudflareConfiguration
{
  string AccountId { get; }
  string Key { get; }
  string ZoneId { get; }
  string KVNamespace { get; }
}

