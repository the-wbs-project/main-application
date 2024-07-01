using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class LibraryEntryVersionResourceDataService : ResourceRecordDataService
{

    public async Task<List<ResourceRecord>> GetListAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryVersionResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        return await ToList(cmd);
    }

    public async Task<ResourceRecord> GetAsync(SqlConnection conn, string entryId, int entryVersion, string resourceId)
    {
        var cmd = new SqlCommand("SELECT TOP 1 * FROM [dbo].[LibraryEntryVersionResources] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [Id] = @ResourceId", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@ResourceId", resourceId);

        var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return ToModel(reader);

        return null;
    }

    public async Task SetAsync(SqlConnection conn, string owner, string entryId, int entryVersion, ResourceRecord resource)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntryVersionResource_Set]", conn)
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
        cmd.Parameters.AddWithValue("@Visibility", DbValue(resource.Visibility));

        await cmd.ExecuteNonQueryAsync();
    }
}
