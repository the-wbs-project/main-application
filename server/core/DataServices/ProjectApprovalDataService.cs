using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System.Data;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectApprovalDataService : BaseSqlDbService
{
    private readonly ILogger<ProjectApprovalDataService> _logger;

    public ProjectApprovalDataService(ILogger<ProjectApprovalDataService> logger, IDatabaseConfig config) : base(config)
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

    public async Task SetAsync(string owner, ProjectApprovalSaveRecord record)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, record);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, ProjectApprovalSaveRecord record)
    {
        var cmd = new SqlCommand("dbo.ProjectApproval_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", "");
        cmd.Parameters.AddWithValue("@ProjectId", record.projectId);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@ApprovedOn", DbValue(record.approvedOn));
        cmd.Parameters.AddWithValue("@ApprovedBy", DbValue(record.approvedBy));
        cmd.Parameters.AddWithValue("@IsApproved", DbJson(record.isApproved));

        foreach (var id in record.ids)
        {
            cmd.Parameters["@Id"].Value = id;
            await cmd.ExecuteNonQueryAsync();
        }
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
