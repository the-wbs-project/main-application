using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ProjectResourceDataService : ResourceRecordDataService
{
    private readonly ILogger<ProjectResourceDataService> _logger;

    public ProjectResourceDataService(ILogger<ProjectResourceDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ResourceRecord>> GetListAsync(string projectId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, projectId);
        }
    }

    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string projectId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectResources] WHERE [ProjectId] = @ProjectId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        return await ToList(cmd);
    }

    public async Task SetAsync(ResourceRecord resource, string owner, string projectId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, projectId, resource);
        }
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
