namespace Wbs.Core.Configuration;

public interface IStorageConfig
{
    string BlobUri { get; }
    string BlobKey { get; }
    string QueueConnectionString { get; }
}