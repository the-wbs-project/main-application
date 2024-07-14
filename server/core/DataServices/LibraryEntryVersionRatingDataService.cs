using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class LibraryEntryVersionReviewDataService : BaseSqlDbService
{
    public async Task<List<LibraryEntryVersionReview>> GetListAsync(SqlConnection conn, string owner, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT [Author], [LastModified], [Anonymous], [Rating], [Comment] FROM [dbo].[LibraryEntryVersionReview] WHERE [OwnerId] = @Owner AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            return LibraryEntryVersionReviewTransformer.ToModelList(reader);
        }
    }
    public async Task<decimal?> GetRatingAsync(SqlConnection conn, string owner, string entryId, int entryVersion)
    {
        var cmd = new SqlCommand("SELECT TOP 1 [Rating] FROM [dbo].[LibraryEntryRatingView] WHERE [OwnerId] = @Owner AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            return reader.IsDBNull(0) ? null : reader.GetDecimal(0);
        }
    }

    public async Task SetAsync(SqlConnection conn, string owner, string entryId, int entryVersion, LibraryEntryVersionReview model)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntryVersionReview_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", model.Id);
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@Author", model.Author);
        cmd.Parameters.AddWithValue("@Anonymous", model.Anonymous);
        cmd.Parameters.AddWithValue("@Rating", model.Rating);
        cmd.Parameters.AddWithValue("@Comment", DbValue(model.Comment));

        await cmd.ExecuteNonQueryAsync();
    }
}
