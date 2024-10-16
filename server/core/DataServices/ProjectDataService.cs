using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class ProjectDataService : BaseSqlDbService
{
    public async Task<List<Project>> GetByOwnerAsync(SqlConnection conn, string owner)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[Projects] WHERE [OwnerId] = @Owner ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        var projects = ProjectTransformer.ToModelList(reader);

        foreach (var project in projects)
            project.Roles = await GetRolesAsync(conn, project.Id);

        return projects;
    }

    public async Task<Project> GetByIdAsync(SqlConnection conn, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[Projects] WHERE [Id] = @Id OR [RecordId] = @Id", conn);

        cmd.Parameters.AddWithValue("@Id", id);

        using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            var project = ProjectTransformer.ToModel(reader);

            project.Roles = await GetRolesAsync(conn, project.Id);

            return project;
        }
        return null;
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@ProjectId", id);
        cmd.Parameters.AddWithValue("@Ownerid", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        return reader.Read() ? reader.GetInt32(0) == 1 : false;
    }

    public async Task SetAsync(SqlConnection conn, Project project)
    {
        if (string.IsNullOrEmpty(project.RecordId))
            project.RecordId = await GetNewRecordIdAsync(conn);

        var cmd = new SqlCommand("dbo.Project_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", project.Id);
        cmd.Parameters.AddWithValue("@RecordId", project.RecordId);
        cmd.Parameters.AddWithValue("@OwnerId", project.Owner);
        cmd.Parameters.AddWithValue("@CreatedBy", project.CreatedBy);
        cmd.Parameters.AddWithValue("@Title", project.Title);
        cmd.Parameters.AddWithValue("@Description", project.Description);
        cmd.Parameters.AddWithValue("@Status", project.Status);
        cmd.Parameters.AddWithValue("@MainNodeView", project.MainNodeView);
        cmd.Parameters.AddWithValue("@Category", project.Category);
        cmd.Parameters.AddWithValue("@Disciplines", DbJson(project.Disciplines));
        cmd.Parameters.AddWithValue("@LibraryLink", DbJson(project.LibraryLink));
        cmd.Parameters.AddWithValue("@ApprovalStarted", DbValue(project.ApprovalStarted));

        await cmd.ExecuteNonQueryAsync();

        await SetRolesAsync(conn, project.Id, project.Roles);
    }

    private async Task<string> GetNewRecordIdAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("[dbo].[Project_GetNewId]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        var output = new SqlParameter("@Id", SqlDbType.VarChar, 10)
        {
            Direction = ParameterDirection.Output
        };

        cmd.Parameters.Add(output);

        await cmd.ExecuteNonQueryAsync();

        return output.Value.ToString();
    }

    private async Task<UserRole[]> GetRolesAsync(SqlConnection conn, string projectId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectRoles] WHERE [ProjectId] = @ProjectId", conn);
        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        using var reader = await cmd.ExecuteReaderAsync();

        return ProjectTransformer.ToRoleArray(reader);
    }

    private async Task SetRolesAsync(SqlConnection conn, string projectId, UserRole[] roles)
    {
        var cmd = new SqlCommand("dbo.ProjectRoles_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@UserRoles", DbJson(roles));

        await cmd.ExecuteNonQueryAsync();
    }
}
