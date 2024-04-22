using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public class WatcherLibraryEntryDataService : BaseSqlDbService
{
    public WatcherLibraryEntryDataService(IDatabaseConfig config) : base(config)
    {
    }

    public async Task<List<string>> GetUsersAsync(string ownerId, string entryId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetUsersAsync(conn, ownerId, entryId);
        }
    }

    public async Task<List<string>> GetUsersAsync(SqlConnection conn, string ownerId, string entryId)
    {
        var results = new List<string>();

        var cmd = new SqlCommand("SELECT [WatcherId] FROM [dbo].[WatchersLibraryEntries] WHERE [OwnerId] = @OwnerId AND [EntryId] = @EntryId", conn);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(reader.GetString(0));
        }
        return results;
    }

    public async Task<int> GetCountAsync(string ownerId, string entryId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetCountAsync(conn, ownerId, entryId);
        }
    }

    public async Task<int> GetCountAsync(SqlConnection conn, string ownerId, string entryId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[WatchersLibraryEntries] WHERE [OwnerId] = @OwnerId AND [EntryId] = @EntryId", conn);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            return reader.Read() ? reader.GetInt32(0) : 0;
        }
    }

    public async Task SetAsync(string ownerId, string entryId, string watcherId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, ownerId, entryId, watcherId);
        }
    }

    public async Task SetAsync(SqlConnection conn, string ownerId, string entryId, string watcherId)
    {
        var cmd = new SqlCommand
        {
            Connection = conn,
            CommandText = "[dbo].[WatchersLibraryEntries_Set]",
            CommandType = CommandType.StoredProcedure,
        };
        cmd.Parameters.AddWithValue("@WatcherId", watcherId);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(string ownerId, string entryId, string watcherId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await DeleteAsync(conn, ownerId, entryId, watcherId);
        }
    }

    public async Task DeleteAsync(SqlConnection conn, string ownerId, string entryId, string watcherId)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[WatchersLibraryEntries] WHERE [OwnerId] = @OwnerId AND [EntryId] = @EntryId AND [WatcherId] = @WatcherId", conn);
        cmd.Parameters.AddWithValue("@WatcherId", watcherId);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        await cmd.ExecuteNonQueryAsync();
    }
}
