using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectDataService : BaseSqlDbService
{
    public async Task<List<Project>> GetByOwnerAsync(SqlConnection conn, string owner)
    {
        var results = new List<Project>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[Projects] WHERE [OwnerId] = @Owner ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<Project> GetByIdAsync(SqlConnection conn, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[Projects] WHERE [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Id", id);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
                return ToModel(reader);
            else
                return null;
        }
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@ProjectId", id);
        cmd.Parameters.AddWithValue("@Ownerid", owner);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetAsync(SqlConnection conn, Project project)
    {
        var cmd = new SqlCommand("dbo.Project_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", project.id);
        cmd.Parameters.AddWithValue("@OwnerId", project.owner);
        cmd.Parameters.AddWithValue("@CreatedBy", project.createdBy);
        cmd.Parameters.AddWithValue("@Title", project.title);
        cmd.Parameters.AddWithValue("@Description", project.description);
        cmd.Parameters.AddWithValue("@Status", project.status);
        cmd.Parameters.AddWithValue("@MainNodeView", project.mainNodeView);
        cmd.Parameters.AddWithValue("@Category", project.category);
        cmd.Parameters.AddWithValue("@Disciplines", DbJson(project.disciplines));
        cmd.Parameters.AddWithValue("@Roles", DbJson(project.roles));
        cmd.Parameters.AddWithValue("@ApprovalStarted", DbValue(project.approvalStarted));

        await cmd.ExecuteNonQueryAsync();
    }

    private Project ToModel(SqlDataReader reader)
    {
        return new Project
        {
            id = DbValue<string>(reader, "Id"),
            owner = DbValue<string>(reader, "OwnerId"),
            createdBy = DbValue<string>(reader, "CreatedBy"),
            createdOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            status = DbValue<string>(reader, "Status"),
            mainNodeView = DbValue<string>(reader, "MainNodeView"),
            category = DbValue<string>(reader, "Category"),

            disciplines = DbJson<Category[]>(reader, "Disciplines"),
            roles = DbJson<ProjectRole[]>(reader, "Roles"),

            approvalStarted = DbValue<bool?>(reader, "ApprovalStarted"),
        };
    }
}
