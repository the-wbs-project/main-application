using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System.Data;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectNodeResourceDataService : ResourceRecordDataService
{
    private readonly ILogger<ProjectNodeResourceDataService> _logger;

    public ProjectNodeResourceDataService(ILogger<ProjectNodeResourceDataService> logger, IDatabaseConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ResourceRecord>> GetListAsync(string projectId, string nodeId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, projectId, nodeId);
        }
    }

    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string projectId, string nodeId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectNodeResources] WHERE [ProjectId] = @ProjectId AND [NodeId] = @NodeId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@NodeId", nodeId);

        return await ToList(cmd);
    }

    public async Task SetAsync(string owner, string projectId, string nodeId, ResourceRecord resource)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, projectId, nodeId, resource);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, string projectId, string nodeId, ResourceRecord resource)
    {
        var cmd = new SqlCommand("dbo.ProjectNodeResources_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(owner));
        cmd.Parameters.AddWithValue("@ProjectId", DbValue(projectId));
        cmd.Parameters.AddWithValue("@ProjectNodeId", DbValue(nodeId));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));

        await cmd.ExecuteNonQueryAsync();
    }
}
