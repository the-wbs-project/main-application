using System.Data;
using Microsoft.Data.SqlClient;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class ContentResourceDataService : BaseSqlDbService
{
    public async Task<List<ContentResource>> GetListAsync(SqlConnection conn, string ownerId, string parentId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ContentResources] WHERE [OwnerId] = @OwnerId AND [ParentId] = @ParentId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@OwnerId", ownerId);
        cmd.Parameters.AddWithValue("@ParentId", parentId);

        using var reader = await cmd.ExecuteReaderAsync();

        return ContentResourceTransformer.ToList(reader);
    }

    public async Task<List<ContentResource>> GetListAsync(SqlConnection conn, string ownerId, IEnumerable<string> parentIds)
    {
        var text = "SELECT * FROM [dbo].[ContentResources] WHERE [OwnerId] = @OwnerId AND [ParentId] IN ({PARAMS}) ORDER BY [Order]";
        var parms = new List<string>();
        var cmd = new SqlCommand
        {
            Connection = conn,
        };

        for (var i = 0; i < parentIds.Count(); i++)
        {
            var paramName = $"@ParentId{i}";
            var value = parentIds.ElementAt(i);

            parms.Add(paramName);
            cmd.Parameters.AddWithValue(paramName, value);
        }

        cmd.CommandText = text.Replace("{PARAMS}", string.Join(",", parms));
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);

        using var reader = await cmd.ExecuteReaderAsync();

        return ContentResourceTransformer.ToList(reader);
    }

    public async Task<ContentResource> GetAsync(SqlConnection conn, string ownerId, string resourceId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ContentResources] WHERE [Id] = @ResourceId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@ResourceId", resourceId);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);

        var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return ContentResourceTransformer.ToModel(reader);

        return null;
    }

    public async Task SetAsync(SqlConnection conn, ContentResource resource)
    {
        var cmd = new SqlCommand("[dbo].[ContentResource_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(resource.OwnerId));
        cmd.Parameters.AddWithValue("@ParentId", DbValue(resource.ParentId));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));
        cmd.Parameters.AddWithValue("@Visibility", DbValue(resource.Visibility));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(SqlConnection conn, string ownerId, string resourceId)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[ContentResources] WHERE [Id] = @ResourceId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@ResourceId", resourceId);
        cmd.Parameters.AddWithValue("@OwnerId", ownerId);

        await cmd.ExecuteNonQueryAsync();
    }
}
