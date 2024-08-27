using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services;

public class VersioningService
{
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly ResourceCopyService resourceCopier;

    public VersioningService(LibraryEntryVersionDataService versionDataService, LibraryEntryNodeDataService nodeDataService, ResourceCopyService resourceCopier)
    {
        this.versionDataService = versionDataService;
        this.nodeDataService = nodeDataService;
        this.resourceCopier = resourceCopier;
    }

    public async Task<int> ReplicateAsync(SqlConnection conn, string owner, string entryId, int version, string alias, string author)
    {
        var versions = await versionDataService.GetListAsync(conn, entryId);
        var current = versions.FirstOrDefault(v => v.Version == version);
        var currentTasks = await nodeDataService.GetListAsync(conn, entryId, version);

        if (current == null)
            throw new Exception("Version not found");

        var newVersion = new LibraryEntryVersion
        {
            EntryId = entryId,
            Version = versions.Select(v => v.Version).Max() + 1,
            VersionAlias = alias,
            Author = author,
            Categories = current.Categories,
            Description = current.Description,
            Disciplines = current.Disciplines,
            Editors = [],
            Status = "draft",
            Title = current.Title,
        };

        await versionDataService.SetAsync(conn, owner, newVersion);
        var newTasks = new List<LibraryEntryNode>();
        var idMap = new Dictionary<string, string>();

        foreach (var t in currentTasks)
        {
            var task = new LibraryEntryNode
            {
                id = IdService.Create(),
                description = t.description,
                disciplineIds = t.disciplineIds,
                libraryLink = t.libraryLink,
                libraryTaskLink = t.libraryTaskLink,
                order = t.order,
                parentId = t.parentId,
                phaseIdAssociation = t.phaseIdAssociation,
                title = t.title,
                visibility = t.visibility,
            };
            newTasks.Add(task);
            idMap[t.id] = task.id;
        }
        //
        //  Now update parent Ids
        //
        foreach (var t in newTasks)
        {
            if (t.parentId != null)
                t.parentId = idMap[t.parentId];
        }

        await nodeDataService.SetAsync(conn, entryId, newVersion.Version, newTasks, []);
        await resourceCopier.LibraryToLibraryAsync(conn, owner, entryId, version, entryId, newVersion.Version);
        await resourceCopier.LibraryTasksToLibraryTasksAsync(conn, owner, entryId, version, entryId, newVersion.Version, idMap);

        return newVersion.Version;
    }
}