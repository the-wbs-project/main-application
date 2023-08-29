using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;
using Wbs.Api.ViewModels;

namespace Wbs.Api.DataServices;

public class ActivityDataService : BaseDbService
{
    private readonly ILogger<ActivityDataService> _logger;

    public ActivityDataService(ILogger<ActivityDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<ActivityViewModel>> GetForTopLevelAsync(string topLevel, int skip, int take)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetForTopLevelAsync(conn, topLevel, skip, take);
        }
    }

    public async Task<List<ActivityViewModel>> GetForTopLevelAsync(SqlConnection conn, string topLevel, int skip, int take)
    {
        var results = new List<ActivityViewModel>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ActivitiesView] WHERE [TopLevelId] = @TopLevel ORDER BY [Timestamp] desc OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY", conn);
        cmd.Parameters.AddWithValue("@TopLevel", topLevel);
        cmd.Parameters.AddWithValue("@Skip", skip);
        cmd.Parameters.AddWithValue("@Take", take);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(this.ToViewModel(reader));
        }
        return results;
    }

    public async Task<List<ActivityViewModel>> GetForChildAsync(string topLevel, string child, int skip, int take)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetForChildAsync(conn, topLevel, child, skip, take);
        }
    }

    public async Task<List<ActivityViewModel>> GetForChildAsync(SqlConnection conn, string topLevel, string child, int skip, int take)
    {
        var results = new List<ActivityViewModel>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[ActivitiesView] WHERE [TopLevelId] = @TopLevel AND [ObjectId] = @Child ORDER BY [Timestamp] desc OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY", conn);

        cmd.Parameters.AddWithValue("@TopLevel", topLevel);
        cmd.Parameters.AddWithValue("@Child", child);
        cmd.Parameters.AddWithValue("@Skip", skip);
        cmd.Parameters.AddWithValue("@Take", take);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
                results.Add(ToViewModel(reader));
        }
        return results;
    }

    public async Task InsertAsync(Activity item)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await InsertAsync(conn, item);
        }
    }

    public async Task InsertAsync(SqlConnection conn, Activity item)
    {
        var cmd = new SqlCommand("dbo.Activity_Insert", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", item.id);
        cmd.Parameters.AddWithValue("@Action", item.action);
        cmd.Parameters.AddWithValue("@Timestamp", item.timestamp);
        cmd.Parameters.AddWithValue("@UserId", item.userId);
        cmd.Parameters.AddWithValue("@TopLevelId", item.topLevelId);
        cmd.Parameters.AddWithValue("@ObjectId", item.objectId);
        cmd.Parameters.AddWithValue("@VersionId", item.versionId);
        cmd.Parameters.AddWithValue("@Data", DbJson(item.data));

        await cmd.ExecuteNonQueryAsync();
    }

    private ActivityViewModel ToViewModel(SqlDataReader reader)
    {
        try
        {
            return new ActivityViewModel
            {
                id = DbValue<string>(reader, "Id"),
                action = DbValue<string>(reader, "Action"),
                timestamp = DbValue<DateTime>(reader, "Timestamp"),
                userId = DbValue<string>(reader, "UserId"),
                topLevelId = DbValue<string>(reader, "TopLevelId"),
                objectId = DbValue<string>(reader, "ObjectId"),
                versionId = DbValue<string>(reader, "VersionId"),
                data = DbJson<Dictionary<string, object>>(reader, "Data"),

                actionDescription = DbValue<string>(reader, "ActionDescription"),
                actionIcon = DbValue<string>(reader, "ActionIcon"),
                actionTitle = DbValue<string>(reader, "ActionTitle"),
            };
        }
        catch (Exception e)
        {
            _logger.LogWarning(DbValue<string>(reader, "Id"));
            _logger.LogWarning(DbValue<string>(reader, "Data"));
            throw;
        }
    }
}
