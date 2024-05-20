using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.ViewModels;

namespace Wbs.Core.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    public async Task<List<LibraryEntryViewModel>> GetByOwnerAsync(SqlConnection conn, string owner)
    {
        var results = new List<LibraryEntryViewModel>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryView] WHERE [OwnerId] = @Owner ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToViewModel(reader));
        }
        return results;
    }

    public async Task<LibraryEntryViewModel> GetViewModelByIdAsync(SqlConnection conn, string owner, string entryId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryView] WHERE [OwnerId] = @Owner AND [EntryId] = @EntryId", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read())
                return ToViewModel(reader);
            else
                return null;
        }
    }

    public async Task<LibraryEntry> GetByIdAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @Owner AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
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
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntries] WHERE [Id] = @LibraryEntryId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@LibraryEntryId", id);
        cmd.Parameters.AddWithValue("@Ownerid", owner);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetAsync(SqlConnection conn, LibraryEntry libraryEntry)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntry_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", libraryEntry.id);
        cmd.Parameters.AddWithValue("@PublishedVersion", DbValue(libraryEntry.publishedVersion));
        cmd.Parameters.AddWithValue("@OwnerId", libraryEntry.owner);
        cmd.Parameters.AddWithValue("@Type", libraryEntry.type);
        cmd.Parameters.AddWithValue("@Author", libraryEntry.author);
        cmd.Parameters.AddWithValue("@Visibility", DbValue(libraryEntry.visibility));
        cmd.Parameters.AddWithValue("@Editors", DbValue(libraryEntry.editors));

        await cmd.ExecuteNonQueryAsync();
    }

    private LibraryEntry ToModel(SqlDataReader reader)
    {
        return new LibraryEntry
        {
            id = DbValue<string>(reader, "Id"),
            publishedVersion = DbValue<int?>(reader, "PublishedVersion"),
            owner = DbValue<string>(reader, "OwnerId"),
            type = DbValue<string>(reader, "Type"),
            author = DbValue<string>(reader, "Author"),
            visibility = DbValue<string>(reader, "Visibility"),
            editors = DbJson<string[]>(reader, "Editors")
        };
    }

    private LibraryEntryViewModel ToViewModel(SqlDataReader reader)
    {
        return new LibraryEntryViewModel
        {
            EntryId = DbValue<string>(reader, "EntryId"),
            Version = DbValue<int>(reader, "Version"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            Type = DbValue<string>(reader, "Type"),
            Title = DbValue<string>(reader, "Title"),
            Description = DbValue<string>(reader, "Description"),
            Status = DbValue<string>(reader, "Status"),
            AuthorId = DbValue<string>(reader, "Author"),
            Visibility = DbValue<string>(reader, "Visibility"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified")
        };
    }
}
