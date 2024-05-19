using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ChatDataService : BaseSqlDbService
{
    public async Task<int> GetNewCommentCount(SqlConnection conn, string threadId, DateTimeOffset timestamp)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ChatComment] WHERE [ThreadId] = @ThreadId AND [Timestamp] > @Timestamp", conn);

        cmd.Parameters.AddWithValue("@ThreadId", threadId);
        cmd.Parameters.AddWithValue("@Timestamp", timestamp);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            return (await reader.ReadAsync()) ? reader.GetInt32(0) : 0;
        }
    }

    public async Task<List<ChatComment>> GetPageAsync(SqlConnection conn, string threadId, int skip, int take)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ChatComment] WHERE [ThreadId] = @ThreadId ORDER BY [Timestamp] OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY", conn);
        cmd.Parameters.AddWithValue("@ThreadId", threadId);
        cmd.Parameters.AddWithValue("@Skip", skip);
        cmd.Parameters.AddWithValue("@Take", take);

        var results = new List<ChatComment>();

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task InsertAsync(SqlConnection conn, ChatComment comment)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[ChatComment] VALUES (@ThreadId, GETUTCDATE(), @Author, @Text)", conn);

        cmd.Parameters.AddWithValue("@ThreadId", comment.threadId);
        cmd.Parameters.AddWithValue("@Author", comment.author);
        cmd.Parameters.AddWithValue("@Text", comment.text);

        await cmd.ExecuteNonQueryAsync();
    }

    private ChatComment ToModel(SqlDataReader reader)
    {
        return new ChatComment
        {
            threadId = DbValue<string>(reader, "ThreadId"),
            timestamp = DbValue<DateTimeOffset>(reader, "Timestamp"),
            author = DbValue<string>(reader, "Author"),
            text = DbValue<string>(reader, "Text"),
        };
    }
}
