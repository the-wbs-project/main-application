using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ListDataService : BaseDbService
{
    private readonly ILogger<ListDataService> _logger;

    public ListDataService(ILogger<ListDataService> logger, IConfiguration config) : base(config)
    {
        this._logger = logger;
    }

    public async Task<List<ListItem>> GetAsync(string type)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetAsync(conn, type);
        }
    }

    public async Task<List<ListItem>> GetAsync(SqlConnection conn, string type)
    {
        var results = new List<ListItem>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[Lists] WHERE [Type] = @Type", conn);
        cmd.Parameters.AddWithValue("@Type", type);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
            {

                results.Add(new ListItem
                {
                    id = DbValue<string>(reader, "Id"),
                    type = DbValue<string>(reader, "Type"),
                    label = DbValue<string>(reader, "Label"),
                    order = DbValue<int>(reader, "Order"),
                    description = DbValue<string>(reader, "Description"),
                    sameAs = DbValue<string>(reader, "SameAs"),
                    icon = DbValue<string>(reader, "Icon"),
                    tags = DbJson<List<string>>(reader, "Tags")
                });
            }
        }
        return results;
    }

    public async Task SetAsync(ListItem item)
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
        cmd.Parameters.AddWithValue("@Order", item.order);
        cmd.Parameters.AddWithValue("@SameAs", item.sameAs);
        cmd.Parameters.AddWithValue("@Icon", item.icon);
        cmd.Parameters.AddWithValue("@Description", DbValue(item.description));
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
    }

    public async Task DeleteAsync(SqlConnection conn, string id, string type)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[Lists] WHERE [Id] = @Id AND [Type] = @Type", conn);

        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@Type", type);

        await cmd.ExecuteNonQueryAsync();
    }
}
