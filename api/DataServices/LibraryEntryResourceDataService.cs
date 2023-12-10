using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Configuration;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class LibraryEntryResourceDataService : ResourceRecordDataService
{
    private readonly ILogger<LibraryEntryResourceDataService> _logger;

    public LibraryEntryResourceDataService(ILogger<LibraryEntryResourceDataService> logger, AppConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ResourceRecord>> GetListAsync(string entryId, int entryVersion)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, entryId, entryVersion);
        }
    }

    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        return await ToList(cmd);
    }

    public async Task SetAsync(string owner, string entryId, int entryVersion, ResourceRecord resource)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, entryId, entryVersion, resource);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, string entryId, int entryVersion, ResourceRecord resource)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryResources_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(owner));
        cmd.Parameters.AddWithValue("@EntryId", DbValue(entryId));
        cmd.Parameters.AddWithValue("@EntryVersion", DbValue(entryVersion));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));

        await cmd.ExecuteNonQueryAsync();
    }
}
