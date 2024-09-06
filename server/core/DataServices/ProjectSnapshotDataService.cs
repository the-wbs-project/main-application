using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectSnapshotDataService : BaseSqlDbService
{
    private readonly ProjectDataService projectDataService;
    private readonly ProjectNodeDataService projectNodeDataService;

    public ProjectSnapshotDataService(ProjectDataService projectDataService, ProjectNodeDataService projectNodeDataService)
    {
        this.projectDataService = projectDataService;
        this.projectNodeDataService = projectNodeDataService;
    }

    public async Task SetAsync(SqlConnection conn, string projectId, IEnumerable<string> activityIds)
    {
        var project = await projectDataService.GetByIdAsync(conn, projectId);
        var nodes = await projectNodeDataService.GetByProjectAsync(conn, projectId);

        foreach (var activityId in activityIds)
        {
            var cmd = new SqlCommand("INSERT INTO [dbo].[ProjectSnapshots] ([ActivityId], [ProjectId], [Timestamp], [Project], [Nodes]) VALUES (@ActivityId, @ProjectId, GETUTCDATE(), @Project, @Nodes)", conn);

            cmd.Parameters.AddWithValue("@ActivityId", activityId);
            cmd.Parameters.AddWithValue("@ProjectId", project.Id);
            cmd.Parameters.AddWithValue("@Project", DbJson(project));
            cmd.Parameters.AddWithValue("@Nodes", DbJson(nodes));

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
