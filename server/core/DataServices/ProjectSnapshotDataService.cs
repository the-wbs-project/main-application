using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectSnapshotDataService : BaseSqlDbService
{
    public async Task SetAsync(SqlConnection conn, string activityId, Project project, ProjectNode[] nodes)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[ProjectSnapshots] ([ActivityId], [ProjectId], [Timestamp], [Project], [Nodes]) VALUES (@ActivityId, @ProjectId, GETUTCDATE(), @Project, @Nodes)", conn);

        cmd.Parameters.AddWithValue("@ActivityId", activityId);
        cmd.Parameters.AddWithValue("@ProjectId", project.id);
        cmd.Parameters.AddWithValue("@Project", DbJson(project));
        cmd.Parameters.AddWithValue("@Nodes", DbJson(nodes));

        await cmd.ExecuteNonQueryAsync();
    }
}
