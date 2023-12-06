namespace Wbs.Api.Configuration;

public class StorageConfig
{
    public StorageConfig(string uri, string key)
    {
        Uri = uri;
        Key = key;
    }

    public string Uri { get; private set; }
    public string Key { get; private set; }
}