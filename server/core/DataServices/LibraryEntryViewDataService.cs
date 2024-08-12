using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System.Data;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.DataServices;

public class LibraryEntryViewDataService : BaseSqlDbService
{
    private readonly ILogger logger;

    public LibraryEntryViewDataService(ILoggerFactory loggerFactory)
    {
        logger = loggerFactory.CreateLogger<LibraryEntryViewDataService>();
    }

    public async Task<IEnumerable<LibraryViewModel>> GetAllAsync(SqlConnection conn, string owner)
    {
        var cmd = new SqlCommand("SELECT * from [dbo].[LibraryEntryView] WHERE OwnerId = @Owner AND Status = 'published'", conn);

        cmd.Parameters.AddWithValue("@Owner", owner);

        using var reader = await cmd.ExecuteReaderAsync();

        return LibraryViewModelTransformer.ToViewModelList(reader);
    }

    public async Task<IEnumerable<LibraryDraftViewModel>> GetDraftsAsync(SqlConnection conn, string owner, string userId, string types)
    {
        var cmd = new SqlCommand("[dbo].[Library_GetDrafts]", conn) { CommandType = CommandType.StoredProcedure };

        cmd.Parameters.AddWithValue("@OwnerId", owner);
        cmd.Parameters.AddWithValue("@UserId", userId);
        cmd.Parameters.AddWithValue("@Types", types);

        using var reader = await cmd.ExecuteReaderAsync();

        return LibraryDraftViewModelTransformer.ToViewModelList(reader);
    }
}
