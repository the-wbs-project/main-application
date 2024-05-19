namespace Wbs.Core.DataServices;

public class ResourceFileStorageService
{
    private readonly Storage storage;

    public ResourceFileStorageService(Storage storage)
    {
        this.storage = storage;
    }

    public Task<byte[]> GetStaticFileAsync(string fileName)
    {
        return storage.GetFileAsBytesAsync("templates", fileName);
    }

    public Task<byte[]> GetLibraryResourceAsync(string owner, string entryId, int versionId, string resourceId)
    {
        return storage.GetFileAsBytesAsync("resources", GetLibraryPath(owner, entryId, versionId, resourceId));
    }

    public Task SaveLibraryResourceAsync(string owner, string entryId, int versionId, string resourceId, byte[] file)
    {
        return storage.SaveFileAsync("resources", GetLibraryPath(owner, entryId, versionId, resourceId), file, true);
    }

    public Task<byte[]> GetLibraryTaskResourceAsync(string owner, string entryId, int versionId, string taskId, string resourceId)
    {
        return storage.GetFileAsBytesAsync("resources", GetLibraryTaskPath(owner, entryId, versionId, taskId, resourceId));
    }

    public Task SaveLibraryTaskResourceAsync(string owner, string entryId, int versionId, string taskId, string resourceId, byte[] file)
    {
        return storage.SaveFileAsync("resources", GetLibraryTaskPath(owner, entryId, versionId, taskId, resourceId), file, true);
    }

    public Task<byte[]> GetProjectResourceAsync(string owner, string projectId, string resourceId)
    {
        return storage.GetFileAsBytesAsync("resources", GetProjectPath(owner, projectId, resourceId));
    }

    public Task SaveProjectResourceAsync(string owner, string projectId, string resourceId, byte[] file)
    {
        return storage.SaveFileAsync("resources", GetProjectPath(owner, projectId, resourceId), file, true);
    }

    public Task<byte[]> GetProjectTaskResourceAsync(string owner, string projectId, string taskId, string resourceId)
    {
        return storage.GetFileAsBytesAsync("resources", GetProjectyTaskPath(owner, projectId, taskId, resourceId));
    }

    public Task SaveProjectTaskResourceAsync(string owner, string projectId, string taskId, string resourceId, byte[] file)
    {
        return storage.SaveFileAsync("resources", GetProjectyTaskPath(owner, projectId, taskId, resourceId), file, true);
    }

    private string GetLibraryPath(string owner, string entryId, int versionId, string resourceId)
    {
        return string.Join('-', owner, "lib", entryId, versionId, "res", resourceId);
    }

    private string GetLibraryTaskPath(string owner, string entryId, int versionId, string taskId, string resourceId)
    {
        return string.Join('-', owner, "lib", entryId, versionId, "tasks", taskId, "res", resourceId);
    }

    private string GetProjectPath(string owner, string projectId, string resourceId)
    {
        return string.Join('-', owner, "proj", projectId, "resources", resourceId);
    }

    private string GetProjectyTaskPath(string owner, string projectId, string taskId, string resourceId)
    {
        return string.Join('-', owner, "proj", projectId, "tasks", taskId, "resources", resourceId);
    }
}
