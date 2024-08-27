using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class LibraryEntryNodeResourceDataService : ResourceRecordDataService
{
    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string entryId, int entryVersion, string entryNodeId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryNodeResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [EntryNodeId] = @EntryNodeId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@EntryNodeId", entryNodeId);

        return await ToList(cmd);
    }

    public async Task<ResourceRecord> GetAsync(SqlConnection conn, string entryId, int entryVersion, string entryNodeId, string resourceId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryNodeResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [EntryNodeId] = @EntryNodeId AND [Id] = @ResourceId", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@EntryNodeId", entryNodeId);
        cmd.Parameters.AddWithValue("@ResourceId", resourceId);

        var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return ToModel(reader);

        return null;
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
        cmd.Parameters.AddWithValue("@Visibility", DbValue(resource.Visibility));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(SqlConnection conn, string entryId, int entryVersion, string entryNodeId, string resourceId)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[LibraryEntryNodeResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [EntryNodeId] = @EntryNodeId AND [Id] = @ResourceId", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@EntryNodeId", entryNodeId);
        cmd.Parameters.AddWithValue("@ResourceId", resourceId);

        await cmd.ExecuteNonQueryAsync();
    }
}
