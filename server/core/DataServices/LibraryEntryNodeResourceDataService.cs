using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System.Data;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class LibraryEntryNodeResourceDataService : ResourceRecordDataService
{
    private readonly ILogger<LibraryEntryNodeResourceDataService> _logger;

    public LibraryEntryNodeResourceDataService(ILogger<LibraryEntryNodeResourceDataService> logger, IDatabaseConfig config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ResourceRecord>> GetListAsync(string entryId, int entryVersion, string entryNodeId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListAsync(conn, entryId, entryVersion, entryNodeId);
        }
    }

    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string entryId, int entryVersion, string entryNodeId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryNodeResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [EntryNodeId] = @EntryNodeId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@EntryNodeId", entryNodeId);

        return await ToList(cmd);
    }

    public async Task SetAsync(string owner, string entryId, int entryVersion, string entryNodeId, ResourceRecord resource)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, owner, entryId, entryVersion, entryNodeId, resource);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, string entryId, int entryVersion, string entryNodeId, ResourceRecord resource)
    {
        var cmd = new SqlCommand("dbo.LibraryEntryNodeResource_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(owner));
        cmd.Parameters.AddWithValue("@EntryId", DbValue(entryId));
        cmd.Parameters.AddWithValue("@EntryVersion", DbValue(entryVersion));
        cmd.Parameters.AddWithValue("@EntryNodeId", DbValue(entryNodeId));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));

        await cmd.ExecuteNonQueryAsync();
    }
}
