using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public class Storage
{
    private readonly BlobServiceClient blobClient;
    private readonly ILogger logger;

    public Storage(ILoggerFactory loggerFactory, IStorageConfig config)
    {
        logger = loggerFactory.CreateLogger<Storage>();
        blobClient = new BlobServiceClient(
           new Uri(config.BlobUri),
           new AzureSasCredential(config.BlobKey));
    }

    public Task<byte[]> GetFileAsBytesAsync(string containerName, string[] folders, string fileName)
    {
        return GetFileAsBytesAsync(containerName, string.Join('/', folders, fileName));
    }

    public async Task<byte[]> GetFileAsBytesAsync(string containerName, string fileName)
    {
        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        if (!await blob.ExistsAsync()) return null;

        BlobDownloadStreamingResult results = await blob.DownloadStreamingAsync();

        using (var stream = new MemoryStream())
        {
            results.Content.CopyTo(stream);

            return stream.ToArray();
        }
    }

    public Task SaveFileAsync(string containerName, string[] folders, string fileName, byte[] data)
    {
        return SaveFileAsync(containerName, string.Join('/', folders) + "/" + fileName, data);
    }

    public async Task SaveFileAsync(string containerName, string fileName, byte[] data)
    {
        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        await blob.DeleteIfExistsAsync();
        await blob.UploadAsync(new BinaryData(data));
    }

    public async Task SaveFileAsync(string containerName, string fileName, string data)
    {
        logger.LogInformation($"Saving file {fileName} to container {containerName}");

        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        await blob.DeleteIfExistsAsync();
        await blob.UploadAsync(new BinaryData(data));
    }

    public Task DeleteIfExistsAsync(string containerName, string[] folders, string fileName)
    {
        return DeleteIfExistsAsync(containerName, string.Join('/', folders) + "/" + fileName);
    }

    public async Task DeleteIfExistsAsync(string containerName, string fileName)
    {
        logger.LogInformation($"deleting file {fileName} to container {containerName}");

        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        await blob.DeleteIfExistsAsync();
    }

    private async Task<BlobContainerClient> GetContainerAsync(string containerName)
    {
        var container = blobClient.GetBlobContainerClient(containerName.ToLower());

        await container.CreateIfNotExistsAsync();

        return container;
    }
}
