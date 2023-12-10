using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class ImportLibraryEntryService
{
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryNodeDataService entryNodeDataService;
    private readonly LibraryEntryNodeResourceDataService entryNodeResourceDataService;
    private readonly LibraryEntryResourceDataService entryResourceDataService;
    private readonly LibraryEntryVersionDataService entryVersionDataService;

    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService projectNodeDataService;
    private readonly ProjectNodeResourceDataService projectNodeResourceDataService;
    private readonly ProjectResourceDataService projectResourceDataService;

    public ImportLibraryEntryService(
        LibraryEntryDataService entryDataService,
        LibraryEntryNodeDataService entryNodeDataService,
        LibraryEntryNodeResourceDataService entryNodeResourceDataService,
        LibraryEntryResourceDataService entryResourceDataService,
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

    public async Task<LibraryEntryNodeImportResults> ImportFromProjectAsync(string owner, string projectId, string author)
    {
        using (var conn = projectDataService.CreateConnection())
        {
            await conn.OpenAsync();

            var project = await projectDataService.GetByIdAsync(conn, projectId);
            var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);
            var projectResources = await projectResourceDataService.GetListAsync(conn, projectId);

            var libraryEntry = new LibraryEntry
            {
                author = author,
                description = project.description,
                id = IdService.Create(),
                lastModified = DateTimeOffset.Now,
                owner = owner,
                title = project.title,
                publishedVersion = null,
                visibility = 1
            };
            var libraryEntryVersion = new LibraryEntryVersion
            {
                entryId = libraryEntry.id,
                version = 1,
                categories = new string[] { project.category },
                disciplines = project.disciplines,
                phases = project.phases,
                status = "draft"
            };

            var results = new LibraryEntryNodeImportResults
            {
                newId = libraryEntry.id,
                resourceConversions = new Dictionary<string, string>()
            };

            var libraryEntryResourceSaves = projectResources.Select(r =>
            {
                var oldId = r.Id;
                var newId = IdService.Create();

                r.Id = newId;

                results.resourceConversions.Add(oldId, newId);

                return entryResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, r);
            }).ToList();
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

                var nodeResources = await projectNodeResourceDataService.GetListAsync(conn, projectId, n.id);

                foreach (var nr in nodeResources)
                {
                    var oldId = nr.Id;
                    var newId = IdService.Create();

                    nr.Id = newId;

                    results.resourceConversions.Add(oldId, newId);

                    libraryEntryNodeResourceSaves.Add(entryNodeResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, libraryNode.id, nr));
                }
            }
            //
            //  Now loop through the nodes and fix the parent ids.
            //
            foreach (var n in libraryEntryNodes)
            {
                if (n.parentId != null)
                    n.parentId = nodeIds[n.parentId];
            }

            await entryDataService.SetAsync(conn, libraryEntry);
            await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);
            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, n)));
            await Task.WhenAll(libraryEntryResourceSaves);
            await Task.WhenAll(libraryEntryNodeResourceSaves);

            return results;
        }
    }

    public async Task<string> ImportFromProjectNodeAsync(string owner, string projectId, string nodeId, string author)
    {
        using (var conn = projectDataService.CreateConnection())
        {
            await conn.OpenAsync();

            var project = await projectDataService.GetByIdAsync(conn, projectId);
            var projectNodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);
            //
            //  Get the node's resources and call it the project's resources.
            //
            var projectResources = await projectNodeResourceDataService.GetListAsync(conn, projectId, nodeId);
            var projectNode = projectNodes.SingleOrDefault(x => x.id == nodeId);

            var libraryEntry = new LibraryEntry
            {
                author = author,
                description = projectNode.description,
                id = IdService.Create(),
                lastModified = DateTimeOffset.Now,
                owner = owner,
                title = projectNode.title,
                publishedVersion = null,
                visibility = 1
            };
            var libraryEntryVersion = new LibraryEntryVersion
            {
                entryId = libraryEntry.id,
                version = 1,
                categories = new string[] { project.category },
                disciplines = GetDisciplinesForNode(project, projectNode),
                status = "draft"
            };
            //
            //  This converts the main node's resources to the library entry's resources
            //
            var libraryEntryResourceSaves = projectResources.Select(r =>
            {
                r.Id = IdService.Create();

                return entryResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, r);
            }).ToList();

            var libraryEntryNodes = new List<LibraryEntryNode>();
            var libraryEntryNodeResourceSaves = new List<Task>();

            var nodeIds = new Dictionary<string, string>();

            foreach (var n in GetProjectNodes(projectNodes, nodeId))
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

                var nodeResources = await projectNodeResourceDataService.GetListAsync(conn, projectId, n.id);

                foreach (var nr in nodeResources)
                {
                    nr.Id = IdService.Create();

                    libraryEntryNodeResourceSaves.Add(entryNodeResourceDataService.SetAsync(conn, owner, libraryEntry.id, libraryEntryVersion.version, libraryNode.id, nr));
                }
            }
            //
            //  Now loop through the nodes and fix the parent ids.
            //
            foreach (var n in libraryEntryNodes)
            {
                if (n.parentId != null)
                    n.parentId = nodeIds[n.parentId];
            }

            await entryDataService.SetAsync(conn, libraryEntry);
            await entryVersionDataService.SetAsync(conn, owner, libraryEntryVersion);

            await Task.WhenAll(libraryEntryNodes.Select(n => entryNodeDataService.SetAsync(conn, owner, n)));

            await Task.WhenAll(libraryEntryResourceSaves);
            await Task.WhenAll(libraryEntryNodeResourceSaves);

            return libraryEntry.id;
        }
    }

    private object[] GetDisciplinesForNode(Project project, ProjectNode node)
    {
        return project.disciplines;
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
