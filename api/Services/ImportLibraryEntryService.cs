using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

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

    public ImportLibraryEntryService(
        LibraryEntryDataService entryDataService,
        LibraryEntryNodeDataService entryNodeDataService,
        LibraryEntryNodeResourceDataService entryNodeResourceDataService,
        LibraryEntryVersionResourceDataService entryResourceDataService,
        LibraryEntryVersionDataService entryVersionDataService,
        ProjectDataService projectDataService,
        ProjectNodeDataService projectNodeDataService,
        ProjectNodeResourceDataService projectNodeResourceDataService,
        ProjectResourceDataService projectResourceDataService)
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
    }

    public async Task<LibraryEntryNodeImportResults> ImportFromProjectAsync(string owner, string projectId, ProjectToLibraryOptions options)
    {
        using (var conn = projectDataService.CreateConnection())
        {
            await conn.OpenAsync();

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
                categories = options.categories,
                disciplines = project.disciplines,
                phases = project.phases,
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

            foreach (var n in projectNodes.Where(r => !r.removed))
            {
                var libraryNode = new LibraryEntryNode
                {
                    id = IdService.Create(),
                    entryId = libraryEntry.id,
                    entryVersion = 1,
                    title = n.title,
                    description = n.description,
                    parentId = n.parentId,
                    createdOn = DateTimeOffset.Now,
                    disciplineIds = n.disciplineIds,
                    lastModified = DateTimeOffset.Now,
                    order = n.order,
                    removed = false
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
            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, n)));

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
        using (var conn = projectDataService.CreateConnection())
        {
            await conn.OpenAsync();

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
                categories = options.categories,
                lastModified = DateTimeOffset.Now,
                title = options.title ?? projectNode.title,
                description = options.description ?? projectNode.description,
                phases = options.phase != null ? new object[] { options.phase } : null
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
                    entryId = libraryEntry.id,
                    entryVersion = 1,
                    title = n.title,
                    description = n.description,
                    parentId = n.parentId,
                    createdOn = DateTimeOffset.Now,
                    disciplineIds = n.disciplineIds,
                    lastModified = DateTimeOffset.Now,
                    order = n.order,
                    removed = false
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
            libraryEntryVersion.disciplines = GetDisciplinesForNode(project,
                libraryEntryNodes.SelectMany(x => x.disciplineIds).Distinct());

            await entryDataService.SetAsync(conn, libraryEntry);
            await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);

            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, n)));

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

    private object[] GetDisciplinesForNode(Project project, IEnumerable<string> disciplineIds)
    {
        var projDisciplineIds = new List<string>();
        var projDiscilineItems = new Dictionary<string, ListItem>();

        foreach (var d in project.disciplines)
        {
            if (d is string)
            {
                projDisciplineIds.Add((string)d);
            }
            else
            {
                var li = (ListItem)d;
                projDiscilineItems.Add(li.id, li);
            }
        }
        var nodeDisciplines = new List<object>();

        foreach (var d in disciplineIds)
        {
            if (projDisciplineIds.Contains(d))
            {
                nodeDisciplines.Add(d);
            }
            else if (projDiscilineItems.ContainsKey(d))
            {
                nodeDisciplines.Add(projDiscilineItems[d]);
            }

        }
        return nodeDisciplines.ToArray();
    }

    private List<ProjectNode> GetProjectNodes(List<ProjectNode> projectNodes, string parentNodeId)
    {
        var nodes = new List<ProjectNode>();

        foreach (var child in projectNodes.Where(x => x.parentId == parentNodeId && x.removed == false))
        {
            nodes.Add(child);
            nodes.AddRange(GetProjectNodes(projectNodes, child.id));
        }

        return nodes;
    }
}
