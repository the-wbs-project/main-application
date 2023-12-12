using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Configuration;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    private readonly ILogger<LibraryEntryDataService> _logger;

    public LibraryEntryDataService(ILogger<LibraryEntryDataService> logger, AppConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<LibraryEntry>> GetByOwnerAsync(string owner)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByOwnerAsync(conn, owner);
        }
    }

    public async Task<List<LibraryEntry>> GetByOwnerAsync(SqlConnection conn, string owner)
    {
        var results = new List<LibraryEntry>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @Owner ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
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
        var cmd = new SqlCommand("dbo.LibraryEntry_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", libraryEntry.id);
        cmd.Parameters.AddWithValue("@PublishedVersion", DbValue(libraryEntry.publishedVersion));
        cmd.Parameters.AddWithValue("@OwnerId", libraryEntry.owner);
        cmd.Parameters.AddWithValue("@Author", libraryEntry.author);
        cmd.Parameters.AddWithValue("@Title", libraryEntry.title);
        cmd.Parameters.AddWithValue("@Description", DbValue(libraryEntry.description));
        cmd.Parameters.AddWithValue("@Visibility", DbValue(libraryEntry.visibility));

        await cmd.ExecuteNonQueryAsync();
    }

    private LibraryEntry ToModel(SqlDataReader reader)
    {
        return new LibraryEntry
        {
            id = DbValue<string>(reader, "Id"),
            publishedVersion = DbValue<int?>(reader, "PublishedVersion"),
            owner = DbValue<string>(reader, "OwnerId"),
            author = DbValue<string>(reader, "Author"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            visibility = DbValue<int>(reader, "Description")
        };
    }
}
