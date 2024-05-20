using System.Text.Json;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services;

public class ImportLibraryEntryService
{
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryNodeDataService entryNodeDataService;
    private readonly LibraryEntryNodeResourceDataService entryNodeResourceDataService;
    private readonly LibraryEntryVersionResourceDataService entryResourceDataService;
    private readonly LibraryEntryVersionDataService entryVersionDataService;

    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService projectNodeDataService;
    private readonly ProjectNodeResourceDataService projectNodeResourceDataService;
    private readonly ProjectResourceDataService projectResourceDataService;
    private readonly DbService db;

    public ImportLibraryEntryService(
        LibraryEntryDataService entryDataService,
        LibraryEntryNodeDataService entryNodeDataService,
        LibraryEntryNodeResourceDataService entryNodeResourceDataService,
        LibraryEntryVersionResourceDataService entryResourceDataService,
        LibraryEntryVersionDataService entryVersionDataService,
        ProjectDataService projectDataService,
        ProjectNodeDataService projectNodeDataService,
        ProjectNodeResourceDataService projectNodeResourceDataService,
        ProjectResourceDataService projectResourceDataService,
        DbService db)
    {
        this.entryDataService = entryDataService;
        this.entryNodeDataService = entryNodeDataService;
        this.entryNodeResourceDataService = entryNodeResourceDataService;
        this.entryResourceDataService = entryResourceDataService;
        this.entryVersionDataService = entryVersionDataService;
        this.projectDataService = projectDataService;
        this.projectNodeDataService = projectNodeDataService;
        this.projectNodeResourceDataService = projectNodeResourceDataService;
        this.projectResourceDataService = projectResourceDataService;
        this.db = db;
    }

    public async Task<LibraryEntryNodeImportResults> ImportFromProjectAsync(string owner, string projectId, ProjectToLibraryOptions options)
    {
        using (var conn = await db.CreateConnectionAsync())
        {
            var project = await projectDataService.GetByIdAsync(conn, projectId);
            var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);

            var libraryEntry = new LibraryEntry
            {
                id = IdService.Create(),
                type = "project",
                owner = owner,
                author = options.author,
                visibility = options.visibility
            };
            var libraryEntryVersion = new LibraryEntryVersion
            {
                entryId = libraryEntry.id,
                version = 1,
                title = options.title ?? project.title,
                description = options.description ?? project.description,
                lastModified = DateTimeOffset.Now,
                disciplines = project.disciplines,
                status = "draft"
            };

            var results = new LibraryEntryNodeImportResults
            {
                newId = libraryEntry.id,
                resourceConversions = new Dictionary<string, string>()
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
            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, libraryEntry.id, 1, n)));

            if (options.includeResources)
            {
                var libraryEntryResourceSaves = (await projectResourceDataService.GetListAsync(conn, projectId))
                    .Select(r =>
                    {
                        var oldId = r.Id;
                        var newId = IdService.Create();

                        r.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        return entryResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, r);
                    })
                    .ToList();

                foreach (var nId in nodeIds.Keys)
                {
                    var nodeResources = await projectNodeResourceDataService.GetListAsync(conn, projectId, nId);

                    foreach (var nr in nodeResources)
                    {
                        var oldId = nr.Id;
                        var newId = IdService.Create();

                        nr.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        libraryEntryNodeResourceSaves.Add(
                            entryNodeResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, nodeIds[nId], nr));
                    }
                }

                await Task.WhenAll(libraryEntryResourceSaves);
                await Task.WhenAll(libraryEntryNodeResourceSaves);
            }

            return results;
        }
    }

    public async Task<LibraryEntryNodeImportResults> ImportFromProjectNodeAsync(string owner, string projectId, string nodeId, ProjectNodeToLibraryOptions options)
    {
        using (var conn = await db.CreateConnectionAsync())
        {
            var project = await projectDataService.GetByIdAsync(conn, projectId);
            var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);
            var projectNode = projectNodes.SingleOrDefault(x => x.id == nodeId);

            var libraryEntry = new LibraryEntry
            {
                id = IdService.Create(),
                owner = owner,
                author = options.author,
                type = options.phase != null ? "phase" : "node",
                visibility = options.visibility,
            };
            var libraryEntryVersion = new LibraryEntryVersion
            {
                version = 1,
                status = "draft",
                entryId = libraryEntry.id,
                lastModified = DateTimeOffset.Now,
                title = options.title ?? projectNode.title,
                description = options.description ?? projectNode.description,
            };

            var results = new LibraryEntryNodeImportResults
            {
                newId = libraryEntry.id,
                resourceConversions = new Dictionary<string, string>()
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
            libraryEntryVersion.disciplines = GetDisciplinesForNode(project.disciplines,
                libraryEntryNodes.SelectMany(x => x.disciplineIds).Distinct());

            await entryDataService.SetAsync(conn, libraryEntry);
            await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);

            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, libraryEntry.id, 1, n)));

            if (options.includeResources)
            {
                //
                //  This converts the main node's resources to the library entry's resources
                //
                var libraryEntryResourceSaves = (await projectNodeResourceDataService.GetListAsync(conn, projectId, nodeId))
                    .Select(r =>
                    {
                        var oldId = r.Id;
                        var newId = IdService.Create();

                        r.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        return entryResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, r);
                    });

                var libraryEntryNodeResourceSaves = new List<Task>();
                foreach (var nId in nodeIds.Keys)
                {
                    if (nodeId == nId) continue;

                    var nodeResources = await projectNodeResourceDataService.GetListAsync(conn, projectId, nId);

                    foreach (var nr in nodeResources)
                    {
                        var oldId = nr.Id;
                        var newId = IdService.Create();

                        nr.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        libraryEntryNodeResourceSaves.Add(entryNodeResourceDataService.SetAsync(conn, owner, libraryEntry.id, 1, nodeIds[nId], nr));
                    }
                }
                await Task.WhenAll(libraryEntryResourceSaves);
                await Task.WhenAll(libraryEntryNodeResourceSaves);
            }

            return results;
        }
    }

    public async Task<LibraryEntryNodeImportResults> ImportFromEntryNodeAsync(string owner, string entryId, int versionId, string nodeId, ProjectNodeToLibraryOptions options)
    {
        using (var conn = await db.CreateConnectionAsync())
        {
            var currentVersion = await entryVersionDataService.GetByIdAsync(conn, entryId, versionId);
            var currentTasks = await entryNodeDataService.GetListAsync(conn, entryId, versionId);
            var task = currentTasks.SingleOrDefault(x => x.id == nodeId);

            var libraryEntry = new LibraryEntry
            {
                id = IdService.Create(),
                owner = owner,
                author = options.author,
                type = task.parentId == null ? "phase" : "task",
                visibility = options.visibility,
            };
            var version = new LibraryEntryVersion
            {
                version = 1,
                status = "draft",
                entryId = libraryEntry.id,
                lastModified = DateTimeOffset.Now,
                title = options.title,
                description = task.description,
            };

            var results = new LibraryEntryNodeImportResults
            {
                newId = libraryEntry.id,
                resourceConversions = new Dictionary<string, string>()
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
            version.disciplines = GetDisciplinesForNode(currentVersion.disciplines,
                libraryEntryNodes.SelectMany(x => x.disciplineIds ?? []).Distinct());

            await entryDataService.SetAsync(conn, libraryEntry);
            await entryVersionDataService.SetAsync(conn, owner, version);

            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, libraryEntry.id, 1, n)));

            if (options.includeResources)
            {
                //
                //  This converts the main node's resources to the library entry's resources
                //
                var libraryEntryResourceSaves = (await entryResourceDataService.GetListAsync(conn, entryId, versionId))
                    .Select(r =>
                    {
                        var oldId = r.Id;
                        var newId = IdService.Create();

                        r.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        return entryResourceDataService.SetAsync(conn, owner, libraryEntry.id, version.version, r);
                    });

                var libraryEntryNodeResourceSaves = new List<Task>();
                foreach (var nId in nodeIds.Keys)
                {
                    if (nodeId == nId) continue;

                    var nodeResources = await entryNodeResourceDataService.GetListAsync(conn, entryId, versionId, nId);

                    foreach (var nr in nodeResources)
                    {
                        var oldId = nr.Id;
                        var newId = IdService.Create();

                        nr.Id = newId;

                        results.resourceConversions.Add(oldId, newId);

                        libraryEntryNodeResourceSaves.Add(entryNodeResourceDataService.SetAsync(conn, owner, libraryEntry.id, 1, nodeIds[nId], nr));
                    }
                }
                await Task.WhenAll(libraryEntryResourceSaves);
                await Task.WhenAll(libraryEntryNodeResourceSaves);
            }

            return results;
        }
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
