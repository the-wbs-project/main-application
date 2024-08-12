using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public class LibraryViewModelTransformer : SqlHelpers
{
    public static List<LibraryViewModel> ToViewModelList(SqlDataReader reader)
    {
        var results = new List<LibraryViewModel>();

        while (reader.Read())
            results.Add(ToViewModel(reader));

        return results;
    }

    public static LibraryViewModel ToViewModel(LibrarySearchDocument doc)
    {
        return new LibraryViewModel
        {
            EntryId = doc.EntryId,
            AuthorId = doc.AuthorId,
            AuthorName = doc.AuthorName,
            Title = doc.Title,
            Type = doc.TypeId,
            LastModified = doc.LastModified,
            OwnerId = doc.OwnerId,
            OwnerName = doc.OwnerName,
            Visibility = doc.Visibility,
            Version = doc.Version,
            VersionAlias = doc.VersionAlias,
        };
    }

    public static LibraryViewModel ToViewModel(SqlDataReader reader)
    {
        return new LibraryViewModel
        {
            EntryId = DbValue<string>(reader, "EntryId"),
            Version = DbValue<int?>(reader, "Version"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            Type = DbValue<string>(reader, "Type"),
            VersionAlias = DbValue<string>(reader, "VersionAlias"),
            Title = DbValue<string>(reader, "Title"),
            AuthorId = DbValue<string>(reader, "Author"),
            Visibility = DbValue<string>(reader, "Visibility"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified")
        };
    }
}