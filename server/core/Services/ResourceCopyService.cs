using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;

namespace Wbs.Core.Services;

public class ResourceCopyService
{
    private readonly LibraryEntryNodeResourceDataService libraryTasks;
    private readonly LibraryEntryVersionResourceDataService libraryVersions;
    private readonly ProjectNodeResourceDataService projectTasks;
    private readonly ProjectResourceDataService projects;
    private readonly ResourceFileStorageService storage;

    public ResourceCopyService(
        LibraryEntryNodeResourceDataService libraryTasks,
        LibraryEntryVersionResourceDataService libraryVersions,
        ProjectNodeResourceDataService projectTasks,
        ProjectResourceDataService projects,
        ResourceFileStorageService storage)
    {
        this.libraryTasks = libraryTasks;
        this.libraryVersions = libraryVersions;
        this.projectTasks = projectTasks;
        this.projects = projects;
        this.storage = storage;
    }

    public async Task ProjectToLibraryAsync(SqlConnection conn, string owner, string projectId, string entryId, int versionId)
    {
        var saves = new List<Task>();

        foreach (var resource in await projects.GetListAsync(conn, projectId))
        {
            var projResourceId = resource.Id;
            var libResourceId = IdService.Create();

            resource.Id = libResourceId;

            saves.Add(libraryVersions.SetAsync(conn, owner, entryId, versionId, resource));

            if (!(resource.Type == "pdf" || resource.Type == "image")) continue;

            var file = await storage.GetProjectResourceAsync(owner, projectId, projResourceId);

            saves.Add(storage.SaveLibraryResourceAsync(owner, entryId, versionId, libResourceId, file));
        }
        if (saves.Count > 0) await Task.WhenAll(saves);
    }

    public async Task ProjectTaskToLibraryAsync(SqlConnection conn, string owner, string projectId, string projectTaskId, string entryId, int versionId)
    {
        var saves = new List<Task>();

        foreach (var resource in await projectTasks.GetListAsync(conn, projectId, projectTaskId))
        {
            var projResourceId = resource.Id;
            var libResourceId = IdService.Create();

            resource.Id = libResourceId;

            saves.Add(libraryVersions.SetAsync(conn, owner, entryId, versionId, resource));

            if (!(resource.Type == "pdf" || resource.Type == "image")) continue;

            var file = await storage.GetProjectTaskResourceAsync(owner, projectId, projectTaskId, projResourceId);

            saves.Add(storage.SaveLibraryResourceAsync(owner, entryId, versionId, libResourceId, file));
        }
        if (saves.Count > 0) await Task.WhenAll(saves);
    }

    public async Task LibraryTaskToLibraryAsync(SqlConnection conn, string owner, string sourceLibId, int sourceVersion, string sourceTaskId, string entryId, int versionId)
    {
        var saves = new List<Task>();

        foreach (var resource in await libraryTasks.GetListAsync(conn, sourceLibId, sourceVersion, sourceTaskId))
        {
            var sourceResourceId = resource.Id;
            var destinationResourceId = IdService.Create();

            resource.Id = destinationResourceId;

            saves.Add(libraryVersions.SetAsync(conn, owner, entryId, versionId, resource));

            if (!(resource.Type == "pdf" || resource.Type == "image")) continue;

            var file = await storage.GetLibraryTaskResourceAsync(owner, sourceLibId, sourceVersion, sourceTaskId, sourceResourceId);

            saves.Add(storage.SaveLibraryResourceAsync(owner, entryId, versionId, destinationResourceId, file));
        }

        if (saves.Count > 0) await Task.WhenAll(saves);
    }

    public async Task ProjectTasksToLibraryTasksAsync(SqlConnection conn, string owner, string projectId, string entryId, int versionId, Dictionary<string, string> nodeIds)
    {
        var saves = new List<Task>();

        foreach (var projectTaskId in nodeIds.Keys)
        {
            foreach (var resource in await projectTasks.GetListAsync(conn, projectId, projectTaskId))
            {
                var projResourceId = resource.Id;
                var libResourceId = IdService.Create();

                resource.Id = libResourceId;

                saves.Add(libraryTasks.SetAsync(conn, owner, entryId, versionId, nodeIds[projectTaskId], resource));

                if (!(resource.Type == "pdf" || resource.Type == "image")) continue;

                var file = await storage.GetProjectTaskResourceAsync(owner, projectId, projectTaskId, projResourceId);

                saves.Add(storage.SaveLibraryTaskResourceAsync(owner, entryId, versionId, nodeIds[projectTaskId], libResourceId, file));
            }
        }

        if (saves.Count > 0) await Task.WhenAll(saves);
    }

    public async Task LibraryTasksToLibraryTasksAsync(SqlConnection conn, string owner, string sourceLibId, int sourceVersion, string entryId, int versionId, Dictionary<string, string> nodeIds)
    {
        var saves = new List<Task>();

        foreach (var sourceTaskId in nodeIds.Keys)
        {
            foreach (var resource in await libraryTasks.GetListAsync(conn, sourceLibId, sourceVersion, sourceTaskId))
            {
                var sourceResourceId = resource.Id;
                var destinationResourceId = IdService.Create();

                resource.Id = destinationResourceId;

                saves.Add(libraryTasks.SetAsync(conn, owner, entryId, versionId, nodeIds[sourceTaskId], resource));

                if (!(resource.Type == "pdf" || resource.Type == "image")) continue;

                var file = await storage.GetLibraryTaskResourceAsync(owner, sourceLibId, sourceVersion, sourceTaskId, sourceResourceId);

                saves.Add(storage.SaveLibraryTaskResourceAsync(owner, entryId, versionId, nodeIds[sourceTaskId], destinationResourceId, file));
            }
        }

        if (saves.Count > 0) await Task.WhenAll(saves);
    }
}
