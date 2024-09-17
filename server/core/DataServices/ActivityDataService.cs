using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.ViewModels;

namespace Wbs.Core.DataServices;

public class ActivityDataService : BaseSqlDbService
{
    private readonly ILogger logger;

    public ActivityDataService(ILoggerFactory loggerFactory)
    {
        logger = loggerFactory.CreateLogger<ActivityDataService>();
    }

    public async Task<int> GetCountForTopLevelAsync(SqlConnection conn, string topLevel)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ActivitiesView] WHERE [TopLevelId] = @TopLevel", conn);
        cmd.Parameters.AddWithValue("@TopLevel", topLevel);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0);
        }
        return 0;
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
        ValidateList(results);

        return results;
    }

    public async Task<int> GetCountForChildAsync(SqlConnection conn, string topLevel, string child)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ActivitiesView] WHERE [TopLevelId] = @TopLevel AND [ObjectId] = @Child", conn);

        cmd.Parameters.AddWithValue("@TopLevel", topLevel);
        cmd.Parameters.AddWithValue("@Child", child);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0);
        }
        return 0;
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
        ValidateList(results);

        return results;
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string projectId, string activityId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[Activities] WHERE [Id] = @Id AND [TopLevelId] = @TopLevelId", conn);

        cmd.Parameters.AddWithValue("@Id", activityId);
        cmd.Parameters.AddWithValue("@TopLevelId", projectId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task InsertAsync(SqlConnection conn, Activity item)
    {
        var cmd = new SqlCommand("dbo.Activity_Insert", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", item.id);
        cmd.Parameters.AddWithValue("@Action", item.action);
        cmd.Parameters.AddWithValue("@UserId", item.userId);
        cmd.Parameters.AddWithValue("@TopLevelId", item.topLevelId);
        cmd.Parameters.AddWithValue("@ObjectId", item.objectId);
        cmd.Parameters.AddWithValue("@VersionId", DbJson(item.versionId));
        cmd.Parameters.AddWithValue("@Data", DbJson(item.data));

        await cmd.ExecuteNonQueryAsync();
    }

    private ActivityViewModel ToViewModel(SqlDataReader reader)
    {
        return new ActivityViewModel
        {
            id = DbValue<string>(reader, "Id"),
            action = DbValue<string>(reader, "Action"),
            userId = DbValue<string>(reader, "UserId"),
            timestamp = DbValue<DateTimeOffset>(reader, "Timestamp"),
            topLevelId = DbValue<string>(reader, "TopLevelId"),
            objectId = DbValue<string>(reader, "ObjectId"),
            versionId = DbValue<int?>(reader, "VersionId"),
            data = DbJson<Dictionary<string, object>>(reader, "Data"),

            actionDescription = DbValue<string>(reader, "ActionDescription"),
            actionIcon = DbValue<string>(reader, "ActionIcon"),
            actionTitle = DbValue<string>(reader, "ActionTitle"),
        };
    }

    private void ValidateList(IEnumerable<ActivityViewModel> activities)
    {
        var issues = new List<string>();

        foreach (var activity in activities)
        {
            if ((activity.actionIcon == null || activity.actionTitle == null) && !issues.Contains(activity.action))
            {
                issues.Add(activity.action);

            }
        }

        if (issues.Count == 0) return;

        logger.LogWarning("The following actions are missing title or icon: " + string.Join(',', issues));
    }
}