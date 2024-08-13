using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class LibraryEntryVersionDataService : BaseSqlDbService
{
    public async Task<IEnumerable<LibraryEntryVersion>> GetListAsync(SqlConnection conn, string entryId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId ORDER BY [Version] DESC", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using var reader = await cmd.ExecuteReaderAsync();

        return LibraryEntryVersionTransformer.ToList(reader);
    }

    public async Task<LibraryEntryVersion> GetByIdAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
                return LibraryEntryVersionTransformer.ToModel(reader);
            else
                return null;
        }
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task MarkAsUpdatedAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("UPDATE [dbo].[LibraryEntryVersions] SET [LastModified] = GETUTCDATE() WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task SetAsync(SqlConnection conn, string owner, LibraryEntryVersion entryVersion)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryVersion_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryVersion.EntryId);
        cmd.Parameters.AddWithValue("@Version", entryVersion.Version);
        cmd.Parameters.AddWithValue("@VersionAlias", DbValue(entryVersion.VersionAlias));
        cmd.Parameters.AddWithValue("@Author", entryVersion.Author);
        cmd.Parameters.AddWithValue("@Title", entryVersion.Title);
        cmd.Parameters.AddWithValue("@Description", DbValue(entryVersion.Description));
        cmd.Parameters.AddWithValue("@Status", entryVersion.Status);
        cmd.Parameters.AddWithValue("@Editors", DbJson(entryVersion.Editors));
        cmd.Parameters.AddWithValue("@Categories", DbJson(entryVersion.Categories));
        cmd.Parameters.AddWithValue("@Disciplines", DbJson(entryVersion.Disciplines));

        await cmd.ExecuteNonQueryAsync();
    }
}
