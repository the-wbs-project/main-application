using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    public async Task<LibraryEntry> GetByIdAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @Owner AND [Id] = @Id", conn);

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

    public async Task SetAsync(SqlConnection conn, LibraryEntry libraryEntry)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntry_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", libraryEntry.Id);
        cmd.Parameters.AddWithValue("@PublishedVersion", DbValue(libraryEntry.PublishedVersion));
        cmd.Parameters.AddWithValue("@OwnerId", libraryEntry.OwnerId);
        cmd.Parameters.AddWithValue("@Type", libraryEntry.Type);
        cmd.Parameters.AddWithValue("@Visibility", DbValue(libraryEntry.Visibility));

        await cmd.ExecuteNonQueryAsync();
    }
}
