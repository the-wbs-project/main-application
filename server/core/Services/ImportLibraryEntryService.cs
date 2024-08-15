using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services;

public class ImportLibraryEntryService
{
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryNodeDataService entryNodeDataService;
    private readonly LibraryEntryVersionDataService entryVersionDataService;

    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService projectNodeDataService;
    private readonly ResourceCopyService resourceCopier;
    private readonly DbService db;

    public ImportLibraryEntryService(
        DbService db,
        ResourceCopyService resourceCopier,
        LibraryEntryDataService entryDataService,
        LibraryEntryNodeDataService entryNodeDataService,
        LibraryEntryVersionDataService entryVersionDataService,
        ProjectDataService projectDataService,
        ProjectNodeDataService projectNodeDataService)
    {
        this.db = db;
        this.resourceCopier = resourceCopier;
        this.entryDataService = entryDataService;
        this.entryNodeDataService = entryNodeDataService;
        this.entryVersionDataService = entryVersionDataService;
        this.projectDataService = projectDataService;
        this.projectNodeDataService = projectNodeDataService;
    }

    public async Task<string> ImportFromProjectAsync(SqlConnection conn, string owner, string projectId, ProjectToLibraryOptions options)
    {
        var project = await projectDataService.GetByIdAsync(conn, projectId);
        var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);

        var libraryEntry = new LibraryEntry
        {
            Id = IdService.Create(),
            Type = "project",
            OwnerId = owner,
            Visibility = options.visibility
        };
        var libraryEntryVersion = new LibraryEntryVersion
        {
            EntryId = libraryEntry.Id,
            Version = 1,
            Author = options.author,
            Title = options.title ?? project.title,
            Description = options.description ?? project.description,
            LastModified = DateTimeOffset.Now,
            Disciplines = project.disciplines,
            Status = "draft"
        };

        var libraryEntryNodes = new List<LibraryEntryNode>();
        var libraryEntryNodeResourceSaves = new List<Task>();
        var nodeIds = new Dictionary<string, string>();

        foreach (var n in projectNodes)
        {
            var libraryNode = new LibraryEntryNode
            {
                id = IdService.Create(),
                title = n.title,
                description = n.description,
                parentId = n.parentId,
                createdOn = DateTimeOffset.Now,
                disciplineIds = n.disciplineIds,
                lastModified = DateTimeOffset.Now,
                order = n.order,
            };
            nodeIds.Add(n.id, libraryNode.id);
            libraryEntryNodes.Add(libraryNode);
        }
        //
        //  Now loop through the nodes and fix the parent ids.
        //
        foreach (var n in libraryEntryNodes)
        {
            if (n.parentId != null && nodeIds.ContainsKey(n.parentId))
                n.parentId = nodeIds[n.parentId];
            else
                n.parentId = null;
        }

        await entryDataService.SetAsync(conn, libraryEntry);
        await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);
        await entryNodeDataService.SetAsync(conn, libraryEntry.Id, 1, libraryEntryNodes, []);

        if (options.includeResources)
        {
            await resourceCopier.ProjectToLibraryAsync(conn, owner, projectId, libraryEntry.Id, libraryEntryVersion.Version);
            await resourceCopier.ProjectTasksToLibraryTasksAsync(conn, owner, projectId, libraryEntry.Id, libraryEntryVersion.Version, nodeIds);
        }
        return libraryEntry.Id;
    }

    public async Task<string> ImportFromProjectNodeAsync(SqlConnection conn, string owner, string projectId, string nodeId, ProjectNodeToLibraryOptions options)
    {
        var project = await projectDataService.GetByIdAsync(conn, projectId);
        var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);
        var projectNode = projectNodes.SingleOrDefault(x => x.id == nodeId);

        var libraryEntry = new LibraryEntry
        {
            Id = IdService.Create(),
            OwnerId = owner,
            Type = options.phase != null ? "phase" : "node",
            Visibility = options.visibility,
        };
        var libraryEntryVersion = new LibraryEntryVersion
        {
            Version = 1,
            Status = "draft",
            Author = options.author,
            EntryId = libraryEntry.Id,
            LastModified = DateTimeOffset.Now,
            Title = options.title ?? projectNode.title,
            Description = options.description ?? projectNode.description,
        };

        var libraryEntryNodes = new List<LibraryEntryNode>();
        var nodeIds = new Dictionary<string, string>();
        var nodes = new List<ProjectNode> { projectNode };
        nodes.AddRange(GetProjectNodes(projectNodes, nodeId));
        //
        //  Change the order of the main node to 1.
        //
        projectNode.order = 1;

        foreach (var n in nodes)
        {
            var libraryNode = new LibraryEntryNode
            {
                id = IdService.Create(),
                title = n.title,
                description = n.description,
                parentId = n.parentId,
                createdOn = DateTimeOffset.Now,
                disciplineIds = n.disciplineIds,
                lastModified = DateTimeOffset.Now,
                order = n.order,
            };
            nodeIds.Add(n.id, libraryNode.id);
            libraryEntryNodes.Add(libraryNode);
        }
        //
        //  Now loop through the nodes and fix the parent ids.
        //
        foreach (var n in libraryEntryNodes)
        {
            if (n.parentId != null && nodeIds.ContainsKey(n.parentId))
                n.parentId = nodeIds[n.parentId];
            else
                n.parentId = null;
        }
        libraryEntryVersion.Disciplines = GetDisciplinesForNode(project.disciplines,
            libraryEntryNodes.SelectMany(x => x.disciplineIds).Distinct());

        await entryDataService.SetAsync(conn, libraryEntry);
        await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);
        await entryNodeDataService.SetAsync(conn, libraryEntry.Id, 1, libraryEntryNodes, []);

        if (options.includeResources)
        {
            await resourceCopier.ProjectTaskToLibraryAsync(conn, owner, projectId, nodeId, libraryEntry.Id, libraryEntryVersion.Version);
            await resourceCopier.ProjectTasksToLibraryTasksAsync(conn, owner, projectId, libraryEntry.Id, libraryEntryVersion.Version, nodeIds);
        }
        return libraryEntry.Id;
    }

    public async Task<string> ImportFromEntryNodeAsync(SqlConnection conn, string owner, string entryId, int versionId, string nodeId, ProjectNodeToLibraryOptions options)
    {
        var currentVersion = await entryVersionDataService.GetByIdAsync(conn, entryId, versionId);
        var currentTasks = await entryNodeDataService.GetListAsync(conn, entryId, versionId);
        var task = currentTasks.SingleOrDefault(x => x.id == nodeId);

        var libraryEntry = new LibraryEntry
        {
            Id = IdService.Create(),
            OwnerId = owner,
            Type = task.parentId == null ? "phase" : "task",
            Visibility = options.visibility,
        };
        var version = new LibraryEntryVersion
        {
            Version = 1,
            Status = "draft",
            Author = options.author,
            EntryId = libraryEntry.Id,
            LastModified = DateTimeOffset.Now,
            Title = options.title,
            Description = task.description,
        };

        var libraryEntryNodes = new List<LibraryEntryNode>();
        var nodeIds = new Dictionary<string, string>();
        var nodes = new List<LibraryEntryNode> { task };
        nodes.AddRange(GetLibraryNodes(currentTasks, nodeId));
        //
        //  Change the order of the main node to 1.
        //
        task.order = 1;

        foreach (var n in nodes)
        {
            var libraryNode = new LibraryEntryNode
            {
                id = IdService.Create(),
                title = n.title,
                description = n.description,
                parentId = n.parentId,
                createdOn = DateTimeOffset.Now,
                disciplineIds = n.disciplineIds,
                lastModified = DateTimeOffset.Now,
                order = n.order,
            };
            nodeIds.Add(n.id, libraryNode.id);
            libraryEntryNodes.Add(libraryNode);
        }
        //
        //  Now loop through the nodes and fix the parent ids.
        //
        foreach (var n in libraryEntryNodes)
        {
            if (n.parentId != null && nodeIds.ContainsKey(n.parentId))
                n.parentId = nodeIds[n.parentId];
            else
                n.parentId = null;
        }
        version.Disciplines = GetDisciplinesForNode(currentVersion.Disciplines,
            libraryEntryNodes.SelectMany(x => x.disciplineIds ?? []).Distinct());

        await entryDataService.SetAsync(conn, libraryEntry);
        await entryVersionDataService.SetAsync(conn, owner, version);
        await entryNodeDataService.SetAsync(conn, libraryEntry.Id, 1, libraryEntryNodes, []);

        if (options.includeResources)
        {
            await resourceCopier.LibraryTaskToLibraryAsync(conn, owner, entryId, versionId, nodeId, libraryEntry.Id, version.Version);
            await resourceCopier.LibraryTasksToLibraryTasksAsync(conn, owner, entryId, versionId, libraryEntry.Id, version.Version, nodeIds);
        }
        return libraryEntry.Id;
    }

    private Category[] GetDisciplinesForNode(Category[] disciplines, IEnumerable<string> disciplineIds)
    {
        return disciplines.Where(x => disciplineIds.Contains(x.id)).ToArray();
    }

    private List<ProjectNode> GetProjectNodes(List<ProjectNode> projectNodes, string parentNodeId)
    {
        var nodes = new List<ProjectNode>();

        foreach (var child in projectNodes.Where(x => x.parentId == parentNodeId))
        {
            nodes.Add(child);
            nodes.AddRange(GetProjectNodes(projectNodes, child.id));
        }

        return nodes;
    }

    private List<LibraryEntryNode> GetLibraryNodes(List<LibraryEntryNode> tasks, string parentNodeId)
    {
        var nodes = new List<LibraryEntryNode>();

        foreach (var child in tasks.Where(x => x.parentId == parentNodeId))
        {
            nodes.Add(child);
            nodes.AddRange(GetLibraryNodes(tasks, child.id));
        }

        return nodes;
    }
}

