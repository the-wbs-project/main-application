using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class ChatDataService : BaseDbService
{
    private readonly ILogger<ChatDataService> _logger;

    public ChatDataService(ILogger<ChatDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<int> GetNewCommentCount(string threadId, DateTimeOffset timestamp)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetNewCommentCount(conn, threadId, timestamp);
        }
    }

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

    public async Task<List<ChatComment>> GetPageAsync(string threadId, int skip, int take)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetPageAsync(conn, threadId, skip, take);
        }
    }

    public async Task<List<ChatComment>> GetPageAsync(SqlConnection conn, string threadId, int skip, int take)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[ChatComment] WHERE [ThreadId] = @ThreadId ORDER BY [Timestamp] desc OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY", conn);
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

    public async Task InsertAsync(ChatComment comment)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await InsertAsync(conn, comment);
        }
    }

    public async Task InsertAsync(SqlConnection conn, ChatComment comment)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[ChatComment] VALUES (@ThreadId, GETUTCDATE(), @Author, @Text)", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
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
