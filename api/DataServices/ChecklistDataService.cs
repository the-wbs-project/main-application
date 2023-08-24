using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ChecklistDataService : BaseDbService
{
    private readonly ILogger<ChecklistDataService> _logger;

    public ChecklistDataService(ILogger<ChecklistDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ChecklistGroup>> GetAsync()
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetAsync(conn);
        }
    }

    public async Task<List<ChecklistGroup>> GetAsync(SqlConnection conn)
    {
        var results = new List<ChecklistGroup>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ChecklistGroups] ORDER BY [Order]", conn);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
            {
                var groupId = DbValue<string>(reader, "Id");

                results.Add(new ChecklistGroup
                {
                    id = groupId,
                    order = DbValue<int>(reader, "Order"),
                    description = DbValue<string>(reader, "Description"),
                    items = await GetAllItemsAsync(conn, groupId)
                });
            }
        }
        return results;
    }

    /*public async Task SetAsync(ListItem item)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, item);
        }
    }

    public async Task SetAsync(SqlConnection conn, ListItem item)
    {
        var cmd = new SqlCommand("dbo.List_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", item.id);
        cmd.Parameters.AddWithValue("@Type", item.type);
        cmd.Parameters.AddWithValue("@Label", item.label);
        cmd.Parameters.AddWithValue("@SameAs", item.sameAs);
        cmd.Parameters.AddWithValue("@Icon", item.icon);
        cmd.Parameters.AddWithValue("@Description", item.description);
        cmd.Parameters.AddWithValue("@Tags", DbJson(item.tags));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(string id, string type)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await DeleteAsync(conn, id, type);
        }
    }*/

    public async Task DeleteAsync(SqlConnection conn, string id, string type)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[Lists] WHERE [Id] = @Id AND [Type] = @Type", conn);

        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@Type", type);

        await cmd.ExecuteNonQueryAsync();
    }

    private async Task<List<ChecklistItem>> GetAllItemsAsync(SqlConnection conn, string groupId)
    {
        var results = new List<ChecklistItem>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ChecklistItems] WHERE [GroupId] = @GroupId ORDER BY [Order]", conn);
        cmd.Parameters.AddWithValue("@GroupId", groupId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
            {

                results.Add(new ChecklistItem
                {
                    id = DbValue<string>(reader, "Id"),
                    order = DbValue<int>(reader, "Order"),
                    description = DbValue<string>(reader, "Description"),
                    path = DbValue<string>(reader, "Path"),
                    type = DbValue<string>(reader, "Type"),

                    pass = DbJson<ChecklistTest>(reader, "Pass"),
                    warn = DbJson<ChecklistTest>(reader, "Warn"),
                });
            }
        }
        return results;
    }
}
