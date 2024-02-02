using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Configuration;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class LibraryEntryVersionDataService : BaseSqlDbService
{
    private readonly ILogger<LibraryEntryVersionDataService> _logger;

    public LibraryEntryVersionDataService(ILogger<LibraryEntryVersionDataService> logger, AppConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<LibraryEntryVersion>> GetListAsync(string entryId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, entryId);
        }
    }

    public async Task<List<LibraryEntryVersion>> GetListAsync(SqlConnection conn, string entryId)
    {
        var results = new List<LibraryEntryVersion>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId ORDER BY [Versions]", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<LibraryEntryVersion> GetByIdAsync(string entryId, int entryVersion)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByIdAsync(conn, entryId, entryVersion);
        }
    }

    public async Task<LibraryEntryVersion> GetByIdAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
                return ToModel(reader);
            else
                return null;
        }
    }

    public async Task<bool> VerifyAsync(string owner, string entryId, int entryVersion)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await VerifyAsync(conn, owner, entryId, entryVersion);
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

    public async Task SetAsync(string owner, LibraryEntryVersion entryVersion)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, entryVersion);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, LibraryEntryVersion entryVersion)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryVersion_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryVersion.entryId);
        cmd.Parameters.AddWithValue("@Version", entryVersion.version);
        cmd.Parameters.AddWithValue("@VersionAlias", DbValue(entryVersion.versionAlias));
        cmd.Parameters.AddWithValue("@Title", entryVersion.title);
        cmd.Parameters.AddWithValue("@Description", DbValue(entryVersion.description));
        cmd.Parameters.AddWithValue("@Status", entryVersion.status);
        cmd.Parameters.AddWithValue("@Categories", DbJson(entryVersion.categories));
        cmd.Parameters.AddWithValue("@Phases", DbJson(entryVersion.phases));
        cmd.Parameters.AddWithValue("@Disciplines", DbJson(entryVersion.disciplines));

        await cmd.ExecuteNonQueryAsync();
    }

    private LibraryEntryVersion ToModel(SqlDataReader reader)
    {
        return new LibraryEntryVersion
        {
            entryId = DbValue<string>(reader, "EntryId"),
            version = DbValue<int>(reader, "Version"),
            versionAlias = DbValue<string>(reader, "VersionAlias"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            status = DbValue<string>(reader, "Status"),
            categories = DbJson<string[]>(reader, "Categories"),
            phases = DbJson<object[]>(reader, "Phases"),
            disciplines = DbJson<object[]>(reader, "Disciplines"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
        };
    }
}
