using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectSnapshotDataService : BaseSqlDbService
{
    private readonly ILogger<ProjectSnapshotDataService> logger;

    public ProjectSnapshotDataService(ILogger<ProjectSnapshotDataService> logger, IDatabaseConfig config) : base(config)
    {
        this.logger = logger;
    }

    public async Task SetAsync(string activityId, Project project, ProjectNode[] nodes)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            await SetAsync(conn, activityId, project, nodes);
        }
    }

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
