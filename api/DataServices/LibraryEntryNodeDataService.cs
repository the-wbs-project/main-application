using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Configuration;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class LibraryEntryNodeDataService : BaseSqlDbService
{
    private readonly ILogger<LibraryEntryNodeDataService> _logger;

    public LibraryEntryNodeDataService(ILogger<LibraryEntryNodeDataService> logger, AppConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<LibraryEntryNode>> GetListAsync(string entryId, int entryVersion)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, entryId, entryVersion);
        }
    }

    public async Task<List<LibraryEntryNode>> GetListAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var results = new List<LibraryEntryNode>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryNodes] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [Removed] = 0", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<bool> VerifyAsync(string owner, string entryId, int entryVersion, string nodeId)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();

            return await VerifyAsync(conn, owner, entryId, entryVersion, nodeId);
        }
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string entryId, int entryVersion, string nodeId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntryNodes] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@Id", nodeId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetSaveRecordAsync(string owner, string entryId, int entryVersion, BulkSaveRecord<LibraryEntryNode> record)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetSaveRecordAsync(conn, owner, entryId, entryVersion, record);
        }
    }

    public async Task SetSaveRecordAsync(SqlConnection conn, string owner, string entryId, int entryVersion, BulkSaveRecord<LibraryEntryNode> record)
    {
        foreach (var upsert in record.upserts)
            await SetAsync(conn, owner, upsert);

        foreach (var removeId in record.removeIds)
            await DeleteAsync(conn, owner, entryId, entryVersion, removeId);
    }

    public async Task SetAsync(string owner, LibraryEntryNode node)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, node);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, LibraryEntryNode node)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryNode_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", node.id);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@EntryId", node.entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", node.entryVersion);
        cmd.Parameters.AddWithValue("@ParentId", DbValue(node.parentId));
        cmd.Parameters.AddWithValue("@Title", node.title);
        cmd.Parameters.AddWithValue("@Description", DbValue(node.description));
        cmd.Parameters.AddWithValue("@Order", node.order);
        cmd.Parameters.AddWithValue("@DisciplineIds", DbJson(node.disciplineIds));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(string owner, string entryId, int entryVersion, string id)
    {
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            await DeleteAsync(conn, owner, entryId, entryVersion, id);
        }
    }

    /// <summary>
    ///     Deletes the node.
    /// </summary>
    /// <remarks>
    ///     The owner and project ID are included to make sure that the user has permission to delete the node.
    /// </remarks>
    public async Task DeleteAsync(SqlConnection conn, string owner, string entryId, int entryVersion, string id)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryNode_Delete", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        await cmd.ExecuteNonQueryAsync();
    }

    private LibraryEntryNode ToModel(SqlDataReader reader)
    {
        return new LibraryEntryNode
        {
            id = DbValue<string>(reader, "Id"),
            entryId = DbValue<string>(reader, "EntryId"),
            entryVersion = DbValue<int>(reader, "EntryVersion"),
            parentId = DbValue<string>(reader, "ParentId"),
            createdOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            disciplineIds = DbJson<string[]>(reader, "DisciplineIds"),
            removed = DbValue<bool>(reader, "Removed"),
            order = DbValue<int>(reader, "Order"),
        };
    }
}
