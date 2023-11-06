using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ProjectApprovalDataService : BaseDbService
{
    private readonly ILogger<ProjectApprovalDataService> _logger;

    public ProjectApprovalDataService(ILogger<ProjectApprovalDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ProjectApproval>> GetByProjectAsync(string projectId)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();

            return await GetByProjectAsync(conn, projectId);
        }
    }

    public async Task<List<ProjectApproval>> GetByProjectAsync(SqlConnection conn, string projectId)
    {
        var results = new List<ProjectApproval>();

        var cmd = new SqlCommand("[dbo].[ProjectApproval_Get]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task SetAsync(string owner, ProjectApproval approval)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, approval);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, ProjectApproval approval)
    {
        var cmd = new SqlCommand("dbo.ProjectApproval_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", approval.id);
        cmd.Parameters.AddWithValue("@ProjectId", approval.projectId);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@ApprovedOn", DbValue(approval.approvedOn));
        cmd.Parameters.AddWithValue("@ApprovedBy", DbValue(approval.approvedBy));
        cmd.Parameters.AddWithValue("@IsApproved", DbJson(approval.isApproved));

        await cmd.ExecuteNonQueryAsync();
    }

    private ProjectApproval ToModel(SqlDataReader reader)
    {
        return new ProjectApproval
        {
            id = DbValue<string>(reader, "Id"),
            projectId = DbValue<string>(reader, "ProjectId"),
            approvedOn = DbValue<DateTimeOffset?>(reader, "ApprovedOn"),
            approvedBy = DbValue<string>(reader, "ApprovedBy"),
            isApproved = DbValue<bool?>(reader, "IsApproved")
        };
    }
}
