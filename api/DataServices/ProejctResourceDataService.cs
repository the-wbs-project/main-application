using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ProejctResourceDataService : BaseDbService
{
    private readonly ILogger<ProejctResourceDataService> _logger;

    public ProejctResourceDataService(ILogger<ProejctResourceDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ProjectResource>> GetByProjectAsync(string projectId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByProjectAsync(conn, projectId);
        }
    }

    public async Task<List<ProjectResource>> GetByProjectAsync(SqlConnection conn, string projectId)
    {
        var results = new List<ProjectResource>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectResources] WHERE [ProjectId] = @ProjectId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task SetAsync(ProjectResource resource)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, resource);
        }
    }

    public async Task SetAsync(SqlConnection conn, ProjectResource resource)
    {
        var cmd = new SqlCommand("dbo.ProjectResources_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", resource.Id);
        cmd.Parameters.AddWithValue("@ProjectId", resource.ProjectId);
        cmd.Parameters.AddWithValue("@Name", resource.Name);
        cmd.Parameters.AddWithValue("@Type", resource.Type);
        cmd.Parameters.AddWithValue("@Order", resource.Order);
        cmd.Parameters.AddWithValue("@Resource", resource.Resource);
        cmd.Parameters.AddWithValue("@Description", resource.Description);

        await cmd.ExecuteNonQueryAsync();
    }

    private ProjectResource ToModel(SqlDataReader reader)
    {
        return new ProjectResource
        {
            Id = DbValue<string>(reader, "Id"),
            ProjectId = DbValue<string>(reader, "ProjectId"),
            Name = DbValue<string>(reader, "Name"),
            Type = DbValue<string>(reader, "Type"),
            Order = DbValue<int>(reader, "Order"),
            Resource = DbValue<string>(reader, "Resource"),
            Description = DbValue<string>(reader, "Description"),
        };
    }
}
