namespace Wbs.Core.DataServices;

public class ContentResourceStorageService
{
    private readonly Storage storage;

    public ContentResourceStorageService(Storage storage)
    {
        this.storage = storage;
    }

    //
    // Static files
    //
    public async Task Copy()
    {
        var files = await storage.GetFileNamesAsync("resources");

        foreach (var file in files)
        {
            var parts = file.Split('-');

            if (parts.Length == 2) continue;

            var bytes = await storage.GetFileAsBytesAsync("resources", file);

            await storage.SaveFileAsync("resources", $"{parts[0]}-{parts[parts.Length - 1]}", bytes);
            await storage.SaveFileAsync("resources-backup", file, bytes);
            await storage.DeleteIfExistsAsync("resources", file);
        }
    }

    public Task<byte[]> GetStaticFileAsync(string fileName)
    {
        return storage.GetFileAsBytesAsync("templates", fileName);
    }

    public Task<byte[]> GetResourceAsync(string owner, string resourceId)
    {
        return storage.GetFileAsBytesAsync("resources", $"{owner}-{resourceId}");
    }

    public Task SaveAsync(string owner, string resourceId, byte[] file)
    {
        return storage.SaveFileAsync("resources", $"{owner}-{resourceId}", file);
    }

    public Task DeleteAsync(string owner, string resourceId)
    {
        return storage.DeleteIfExistsAsync("resources", $"{owner}-{resourceId}");
    }

    public async Task CopyResourceAsync(string fromOwner, string fromId, string toOwner, string toId)
    {
        var file = await storage.GetFileAsBytesAsync("resources", $"{fromOwner}-{fromId}");

        if (file == null) return;

        await storage.SaveFileAsync("resources", $"{toOwner}-{toId}", file);
    }
}
