using Microsoft.Extensions.Configuration;
using Wbs.Core.Configuration;

namespace Wbs.Functions.Configuration;

public class AzureStorageConfig : IStorageConfig
{
    public AzureStorageConfig(IConfiguration config)
    {
        BlobUri = config["Blobs:Uri"];
        BlobKey = config["Blobs:SasKey"];
        QueueConnectionString = config["Azure:Storage:Queues"];
    }

    public string BlobUri { get; private set; }
    public string BlobKey { get; private set; }
    public string QueueConnectionString { get; private set; }
}