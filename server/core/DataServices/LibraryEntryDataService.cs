using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    public async Task<LibraryEntry> GetByIdAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @Owner AND ([Id] = @Id OR [RecordId] = @Id)", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@Id", id);

        using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
            return LibraryEntryTransformer.ToModel(reader);
        else
            return null;
    }


    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntries] WHERE [Id] = @LibraryEntryId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@LibraryEntryId", id);
        cmd.Parameters.AddWithValue("@Ownerid", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return reader.GetInt32(0) == 1;

        return false;
    }

    public async Task<LibraryEntry> SetAsync(SqlConnection conn, LibraryEntry libraryEntry)
    {
        if (string.IsNullOrEmpty(libraryEntry.RecordId))
            libraryEntry.RecordId = await GetNewRecordIdAsync(conn);

        var cmd = new SqlCommand("[dbo].[LibraryEntry_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", libraryEntry.Id);
        cmd.Parameters.AddWithValue("@RecordId", libraryEntry.RecordId);
        cmd.Parameters.AddWithValue("@PublishedVersion", DbValue(libraryEntry.PublishedVersion));
        cmd.Parameters.AddWithValue("@OwnerId", libraryEntry.OwnerId);
        cmd.Parameters.AddWithValue("@Type", libraryEntry.Type);
        cmd.Parameters.AddWithValue("@Visibility", DbValue(libraryEntry.Visibility));

        await cmd.ExecuteNonQueryAsync();

        return libraryEntry;
    }

    private async Task<string> GetNewRecordIdAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntry_GetNewId]", conn)
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
}
