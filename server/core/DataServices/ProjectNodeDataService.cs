using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ProjectNodeDataService : BaseSqlDbService
{
    public async Task<List<ProjectNode>> GetByProjectAsync(SqlConnection conn, string projectId)
    {
        var results = new List<ProjectNode>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectNodes] WHERE [Removed] = 0 AND [ProjectId] = @ProjectId ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<ProjectNode> GetByIdAsync(SqlConnection conn, string nodeId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectNodes] WHERE [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Id", nodeId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read())
                return ToModel(reader);
        }
        return null;
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string projectId, string nodeId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ProjectNodes] WHERE [Removed] = 0 AND [ProjectId] = @ProjectId AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@Id", nodeId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetSaveRecordAsync(SqlConnection conn, string owner, string projectId, BulkSaveRecord<ProjectNode> record)
    {
        foreach (var upsert in record.upserts)
            await SetAsync(conn, owner, upsert);

        foreach (var removeId in record.removeIds)
            await DeleteAsync(conn, owner, projectId, removeId);
    }

    public async Task SetAsync(SqlConnection conn, string owner, ProjectNode node)
    {
        var cmd = new SqlCommand("dbo.ProjectNode_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", node.id);
        cmd.Parameters.AddWithValue("@ProjectId", node.projectId);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@ParentId", DbValue(node.parentId));
        cmd.Parameters.AddWithValue("@Title", node.title);
        cmd.Parameters.AddWithValue("@Description", DbValue(node.description));
        cmd.Parameters.AddWithValue("@PhaseIdAssociation", DbValue(node.phaseIdAssociation));
        cmd.Parameters.AddWithValue("@Order", node.order);
        cmd.Parameters.AddWithValue("@DisciplineIds", DbJson(node.disciplineIds));
        cmd.Parameters.AddWithValue("@LibraryLink", DbJson(node.libraryLink));

        await cmd.ExecuteNonQueryAsync();
    }

    /// <summary>
    ///     Deletes the node.
    /// </summary>
    /// <remarks>
    ///     The owner and project ID are included to make sure that the user has permission to delete the node.
    /// </remarks>
    public async Task DeleteAsync(SqlConnection conn, string ownerId, string projectId, string id)
    {
        var cmd = new SqlCommand("dbo.ProjectNode_Delete", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);

        await cmd.ExecuteNonQueryAsync();
    }

    private ProjectNode ToModel(SqlDataReader reader)
    {
        return new ProjectNode
        {
            id = DbValue<string>(reader, "Id"),
            projectId = DbValue<string>(reader, "ProjectId"),
            parentId = DbValue<string>(reader, "ParentId"),
            createdOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            phaseIdAssociation = DbValue<string>(reader, "PhaseIdAssociation"),
            disciplineIds = DbJson<string[]>(reader, "DisciplineIds"),
            libraryLink = DbJson<LibraryLink>(reader, "LibraryLink"),
            order = DbValue<int>(reader, "Order"),
        };
    }
}
