using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectApprovalDataService : BaseSqlDbService
{
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
