using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Configuration;
using Wbs.Api.Models;
using Wbs.Api.ViewModels;

namespace Wbs.Api.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    private readonly ILogger<LibraryEntryDataService> _logger;

    public LibraryEntryDataService(ILogger<LibraryEntryDataService> logger, AppConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<LibraryEntryViewModel>> GetByOwnerAsync(string owner)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByOwnerAsync(conn, owner);
        }
    }

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

    public async Task<LibraryEntry> GetByIdAsync(string owner, string id)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByIdAsync(conn, owner, id);
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

    public async Task<bool> VerifyAsync(string owner, string id)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await VerifyAsync(conn, owner, id);
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

    public async Task SetAsync(LibraryEntry project)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, project);
        }
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
            Author = DbValue<string>(reader, "Author"),
            Visibility = DbValue<string>(reader, "Visibility"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified")
        };
    }
}
