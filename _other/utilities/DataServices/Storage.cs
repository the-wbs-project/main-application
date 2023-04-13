using Wbs.Utilities.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Text;
using System.Threading.Tasks;

namespace Wbs.Utilities.DataServices
{
    public class Storage
    {
        private CloudBlobClient blobClient;

        public Storage(AppConfig config) : this(config.storageConnectionString) { }

        public Storage(string connectionString)
        {
            blobClient = CloudStorageAccount.Parse(connectionString).CreateCloudBlobClient();
        }

        public async Task<string> GetFileAsStringAsync(string containerName, string fileName, Encoding encoding = null)
        {
            var block = await GetBlockByNameAsync(containerName, null, fileName);

            if (!await block.ExistsAsync()) return null;

            if (encoding == null) encoding = Encoding.Default;

            return await block.DownloadTextAsync(encoding, null, null, null);
        }

        public async Task<string> GetFileAsStringAsync(string containerName, string folder, string fileName, Encoding encoding = null)
        {
            var block = await GetBlockByNameAsync(containerName, folder, fileName);

            if (!await block.ExistsAsync()) return null;

            if (encoding == null) encoding = Encoding.Default;

            return await block.DownloadTextAsync(encoding, null, null, null);
        }

        public async Task<byte[]> GetFileAsBytesAsync(string containerName, string fileName)
        {
            var block = await GetBlockByNameAsync(containerName, null, fileName);

            if (!await block.ExistsAsync()) return null;
            return await GetBytes(block);
        }

        public async Task<byte[]> GetFileAsBytesAsync(string containerName, string folder, string fileName)
        {
            var block = await GetBlockByNameAsync(containerName, folder, fileName);

            if (!await block.ExistsAsync()) return null;
            return await GetBytes(block);
        }

        public async Task SaveFileAsync(string containerName, string folder, string fileName, byte[] data, bool snapshot)
        {
            var block = await GetBlockByNameAsync(containerName, folder, fileName);

            if (snapshot && await block.ExistsAsync()) await block.SnapshotAsync();

            await block.UploadFromByteArrayAsync(data, 0, data.Length);
        }

        public async Task SaveFileAsync(string containerName, string folder, string fileName, string data, bool snapshot)
        {
            var block = await GetBlockByNameAsync(containerName, folder, fileName);

            if (snapshot && await block.ExistsAsync()) await block.SnapshotAsync();

            await block.UploadTextAsync(data);
        }

        private async Task<byte[]> GetBytes(CloudBlockBlob block)
        {
            await block.FetchAttributesAsync();
            long fileByteLength = block.Properties.Length;
            byte[] fileContent = new byte[fileByteLength];
            for (int i = 0; i < fileByteLength; i++)
            {
                fileContent[i] = 0x20;
            }
            await block.DownloadToByteArrayAsync(fileContent, 0);
            return fileContent;
        }

        private async Task<CloudBlobContainer> GetContainerAsync(string containerName)
        {
            var container = blobClient.GetContainerReference(containerName.ToLower());
            await container.CreateIfNotExistsAsync();

            return container;
        }

        private async Task<CloudBlockBlob> GetBlockByNameAsync(string containerName, string folder, string name)
        {
            var container = await GetContainerAsync(containerName);

            if (folder != null)
            {
                var folderObj = container.GetDirectoryReference(folder);

                return folderObj.GetBlockBlobReference(name);
            }
            return container.GetBlockBlobReference(name);
        }
    }
}