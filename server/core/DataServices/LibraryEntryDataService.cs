using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.DataServices;

public class LibraryEntryDataService : BaseSqlDbService
{
    public async Task<List<LibraryEntryViewModel>> GetByOwnerAsync(SqlConnection conn, string owner)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryView] WHERE [OwnerId] = @Owner ORDER BY [LastModified] DESC", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        return LibraryEntryTransformer.ToViewModelList(reader);
    }

    public async Task<List<ApiSearchResult<LibraryEntryViewModel>>> GetFilteredAsync(SqlConnection conn, string owner, LibraryFilters filters)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntry_Get]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@UserId", filters.userId);
        cmd.Parameters.AddWithValue("@Visibility", filters.library == "public" ? "public" : "private");
        cmd.Parameters.AddWithValue("@Roles", string.Join(',', filters.roles ?? []));
        cmd.Parameters.AddWithValue("@Types", string.Join(',', filters.types ?? []));

        using var reader = await cmd.ExecuteReaderAsync();

        var docs = LibraryEntryTransformer.ToViewModelList(reader);

        return docs.Select(doc => new ApiSearchResult<LibraryEntryViewModel>
        {
            Document = doc,
            Highlights = null,
            Score = 100,
            SemanticSearch = null
        }).ToList();
    }

    public async Task<LibraryEntryViewModel> GetViewModelByIdAsync(SqlConnection conn, string owner, string entryId)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryView] WHERE [OwnerId] = @Owner AND [EntryId] = @EntryId", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@EntryId", entryId);

        using var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read())
            return LibraryEntryTransformer.ToViewModel(reader);
        else
            return null;
    }

    public async Task<LibraryEntry> GetByIdAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @Owner AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);
        cmd.Parameters.AddWithValue("@Id", id);

        using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
            return LibraryEntryTransformer.ToModel(reader);
        else
            return null;
    }


    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string id)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntries] WHERE [Id] = @LibraryEntryId AND [OwnerId] = @OwnerId", conn);

        cmd.Parameters.AddWithValue("@LibraryEntryId", id);
        cmd.Parameters.AddWithValue("@Ownerid", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        if (reader.Read()) return reader.GetInt32(0) == 1;

        return false;
    }

    public async Task SetAsync(SqlConnection conn, LibraryEntry libraryEntry)
    {
        var cmd = new SqlCommand("[dbo].[LibraryEntry_Set]", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", libraryEntry.id);
        cmd.Parameters.AddWithValue("@PublishedVersion", DbValue(libraryEntry.publishedVersion));
        cmd.Parameters.AddWithValue("@OwnerId", libraryEntry.owner);
        cmd.Parameters.AddWithValue("@Type", libraryEntry.type);
        cmd.Parameters.AddWithValue("@Author", libraryEntry.author);
        cmd.Parameters.AddWithValue("@Visibility", DbValue(libraryEntry.visibility));
        cmd.Parameters.AddWithValue("@Editors", DbValue(libraryEntry.editors));

        await cmd.ExecuteNonQueryAsync();
    }
}
