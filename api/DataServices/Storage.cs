using System.Reflection.Metadata;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Wbs.Api.DataServices;

public class Storage
{
    private readonly BlobServiceClient blobClient;

    public Storage(IConfiguration config)
    {
        blobClient = new BlobServiceClient(
           new Uri(config["Blobs:Uri"]), //"https://<storage-account-name>.blob.core.windows.net"),
          new AzureSasCredential(config["Blobs:SasKey"]));
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

    public async Task<BlobClient> SaveFileAsync(string containerName, string fileName, byte[] data, bool snapshot)
    {
        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        if (snapshot && await blob.ExistsAsync()) await blob.CreateSnapshotAsync();

        await blob.UploadAsync(new BinaryData(data));

        return blob;
    }

    public async Task SaveFileAsync(string containerName, string fileName, string data, bool snapshot)
    {
        var container = await GetContainerAsync(containerName);
        var blob = container.GetBlobClient(fileName);

        if (snapshot && await blob.ExistsAsync()) await blob.CreateSnapshotAsync();

        await blob.UploadAsync(new BinaryData(data));
    }

    private async Task<BlobContainerClient> GetContainerAsync(string containerName)
    {
        var container = blobClient.GetBlobContainerClient(containerName.ToLower());

        await container.CreateIfNotExistsAsync();

        return container;
    }
}
