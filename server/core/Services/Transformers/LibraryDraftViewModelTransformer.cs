using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public class LibraryDraftViewModelTransformer : SqlHelpers
{

    public static IEnumerable<LibraryDraftViewModel> ToViewModelList(SqlDataReader reader)
    {
        var list = new List<LibraryDraftViewModel>();

        while (reader.Read())
            list.Add(ToViewModel(reader));

        return list;
    }

    public static LibraryDraftViewModel ToViewModel(SqlDataReader reader)
    {
        return new LibraryDraftViewModel
        {
            EntryId = DbValue<string>(reader, "Id"),
            RecordId = DbValue<string>(reader, "RecordId"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            Type = DbValue<string>(reader, "Type"),
            Version = DbValue<int>(reader, "Version"),
            VersionAlias = DbValue<string>(reader, "VersionAlias"),
            Title = DbValue<string>(reader, "Title"),
            AuthorId = DbValue<string>(reader, "Author"),
            Visibility = DbValue<string>(reader, "Visibility"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified")
        };
    }
}