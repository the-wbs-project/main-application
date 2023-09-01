using Microsoft.Data.SqlClient;
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
                    //items = await GetAllItemsAsync(conn, groupId)
                });
            }
        }

        foreach (var group in results)
        {
            group.items = await GetAllItemsAsync(conn, group.id);
        }
        return results;
    }

    public async Task SetAsync(ChecklistGroup[] groups)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, groups);
        }
    }

    public async Task SetAsync(SqlConnection conn, ChecklistGroup[] groups)
    {
        await ClearAsync(conn);

        foreach (var group in groups)
        {
            await SetGroupAsync(conn, group);

            foreach (var item in group.items)
            {
                await SetItemAsync(conn, group.id, item);
            }
        }
    }

    private async Task ClearAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("DELETE FROM [dbo].[ChecklistItems]", conn);
        var cmd2 = new SqlCommand("DELETE FROM [dbo].[ChecklistGroups]", conn);

        await cmd.ExecuteNonQueryAsync();
        await cmd2.ExecuteNonQueryAsync();
    }

    private async Task SetGroupAsync(SqlConnection conn, ChecklistGroup group)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[ChecklistGroups] ([Id], [Order], [Description]) VALUES (@Id, @Order, @Description)", conn);

        cmd.Parameters.AddWithValue("@Id", group.id);
        cmd.Parameters.AddWithValue("@Order", group.order);
        cmd.Parameters.AddWithValue("@Description", group.description);

        await cmd.ExecuteNonQueryAsync();
    }

    private async Task SetItemAsync(SqlConnection conn, string groupId, ChecklistItem item)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[ChecklistItems] ([Id], [GroupId], [Order], [Description], [Type], [Path], [Pass], [Warn]) VALUES (@Id, @GroupId, @Order, @Description, @Type, @Path, @Pass, @Warn)", conn);

        cmd.Parameters.AddWithValue("@Id", item.id);
        cmd.Parameters.AddWithValue("@GroupId", groupId);
        cmd.Parameters.AddWithValue("@Order", item.order);
        cmd.Parameters.AddWithValue("@Description", item.description);
        cmd.Parameters.AddWithValue("@Type", item.type);
        cmd.Parameters.AddWithValue("@Path", item.path);
        cmd.Parameters.AddWithValue("@Pass", DbJson(item.pass));
        cmd.Parameters.AddWithValue("@Warn", DbJson(item.warn));

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
