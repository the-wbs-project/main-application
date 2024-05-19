using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectResourceDataService : ResourceRecordDataService
{
    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string projectId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectResources] WHERE [ProjectId] = @ProjectId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        return await ToList(cmd);
    }

    public async Task<ResourceRecord> GetAsync(SqlConnection conn, string projectId, string resourceId)
    {
        var cmd = new SqlCommand("SELECT TOP 1 * FROM [dbo].[ProjectResources] WHERE [ProjectId] = @ProjectId AND [Id] = @ResourceId", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@ResourceId", resourceId);

        var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return ToModel(reader);

        return null;
    }

    public async Task SetAsync(SqlConnection conn, string owner, string projectId, ResourceRecord resource)
    {
        var cmd = new SqlCommand("dbo.ProjectResources_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(owner));
        cmd.Parameters.AddWithValue("@ProjectId", DbValue(projectId));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));

        await cmd.ExecuteNonQueryAsync();
    }
}
