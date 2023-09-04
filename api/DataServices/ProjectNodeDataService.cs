using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ProjectNodeDataService : BaseDbService
{
    private readonly ILogger<ProjectNodeDataService> _logger;

    public ProjectNodeDataService(ILogger<ProjectNodeDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ProjectNode>> GetByProjectAsync(string projectId)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();

            return await GetByProjectAsync(conn, projectId);
        }
    }

    public async Task<List<ProjectNode>> GetByProjectAsync(SqlConnection conn, string projectId)
    {
        var results = new List<ProjectNode>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ProjectNodes] WHERE [ProjectId] = @ProjectId ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<bool> VerifyAsync(string projectId, string nodeId)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();

            return await VerifyAsync(conn, projectId, nodeId);
        }
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string projectId, string nodeId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ProjectNodes] WHERE [ProjectId] = @ProjectId AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@ProjectId", projectId);
        cmd.Parameters.AddWithValue("@Id", nodeId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetSaveRecordAsync(string owner, string projectId, ProjectNodeSaveRecord record)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetSaveRecordAsync(conn, owner, projectId, record);
        }
    }

    public async Task SetSaveRecordAsync(SqlConnection conn, string owner, string projectId, ProjectNodeSaveRecord record)
    {
        foreach (var upsert in record.upserts)
            await SetAsync(conn, owner, upsert);

        foreach (var removeId in record.removeIds)
            await DeleteAsync(conn, owner, projectId, removeId);
    }

    public async Task SetAsync(string owner, ProjectNode node)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, node);
        }
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
        cmd.Parameters.AddWithValue("@Order", node.order);
        cmd.Parameters.AddWithValue("@DisciplineIds", DbJson(node.disciplineIds));
        cmd.Parameters.AddWithValue("@CreatedOn", node.createdOn);
        cmd.Parameters.AddWithValue("@LastModified", node.lastModified);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(string ownerId, string projectId, string id)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await DeleteAsync(conn, ownerId, projectId, id);
        }
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
            createdOn = DbValue<DateTime>(reader, "CreatedOn"),
            lastModified = DbValue<DateTime>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            disciplineIds = DbJson<string[]>(reader, "DisciplineIds"),
            removed = DbValue<bool>(reader, "Removed"),
            order = DbValue<int>(reader, "Order"),
        };
    }
}
