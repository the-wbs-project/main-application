using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;

public class RecordResourceDataService : BaseDbService
{
    private readonly ILogger<RecordResourceDataService> _logger;

    public RecordResourceDataService(ILogger<RecordResourceDataService> logger, IConfiguration config) : base(config)
    {
        _logger = logger;
    }

    public async Task<List<RecordResource>> GetListByRecordIdAsync(string recordId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetListByRecordIdAsync(conn, recordId);
        }
    }

    public async Task<List<RecordResource>> GetListByRecordIdAsync(SqlConnection conn, string recordId)
    {
        var results = new List<RecordResource>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[RecordResources] WHERE [RecordId] = @RecordId ORDER BY [Order]", conn);

        cmd.Parameters.AddWithValue("@RecordId", recordId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<RecordResource> GetByIdAsync(string resourceId, string recordId)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();

            return await GetByIdAsync(conn, resourceId, recordId);
        }
    }

    public async Task<RecordResource> GetByIdAsync(SqlConnection conn, string resourceId, string recordId)
    {
        var cmd = new SqlCommand("SELECT TOP 1 * FROM [dbo].[RecordResources] WHERE [Id] = @Id AND [RecordId] = @RecordId", conn);

        cmd.Parameters.AddWithValue("@RecordId", recordId);
        cmd.Parameters.AddWithValue("@Id", resourceId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            return reader.Read() ? ToModel(reader) : null;
        }
    }

    public async Task SetAsync(RecordResource resource)
    {
        using (var conn = new SqlConnection(cs))
        {
            await conn.OpenAsync();
            await SetAsync(conn, resource);
        }
    }

    public async Task SetAsync(SqlConnection conn, RecordResource resource)
    {
        var cmd = new SqlCommand("dbo.RecordResources_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", DbValue(resource.Id));
        cmd.Parameters.AddWithValue("@OwnerId", DbValue(resource.OwnerId));
        cmd.Parameters.AddWithValue("@RecordId", DbValue(resource.RecordId));
        cmd.Parameters.AddWithValue("@Name", DbValue(resource.Name));
        cmd.Parameters.AddWithValue("@Type", DbValue(resource.Type));
        cmd.Parameters.AddWithValue("@Order", DbValue(resource.Order));
        cmd.Parameters.AddWithValue("@Resource", DbValue(resource.Resource));
        cmd.Parameters.AddWithValue("@Description", DbValue(resource.Description));

        await cmd.ExecuteNonQueryAsync();
    }

    private RecordResource ToModel(SqlDataReader reader)
    {
        return new RecordResource
        {
            Id = DbValue<string>(reader, "Id"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            RecordId = DbValue<string>(reader, "RecordId"),
            Name = DbValue<string>(reader, "Name"),
            Type = DbValue<string>(reader, "Type"),
            Order = DbValue<int>(reader, "Order"),
            CreatedOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            Resource = DbValue<string>(reader, "Resource"),
            Description = DbValue<string>(reader, "Description"),
        };
    }
}
