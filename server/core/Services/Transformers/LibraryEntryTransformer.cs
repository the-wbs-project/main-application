
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public class LibraryEntryTransformer : SqlHelpers
{
    public static List<LibraryEntry> ToModelList(SqlDataReader reader)
    {
        var results = new List<LibraryEntry>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static List<LibraryEntryViewModel> ToViewModelList(SqlDataReader reader)
    {
        var results = new List<LibraryEntryViewModel>();

        while (reader.Read())
            results.Add(ToViewModel(reader));

        return results;
    }

    public static LibraryEntry ToModel(SqlDataReader reader)
    {
        return new LibraryEntry
        {
            id = DbValue<string>(reader, "Id"),
            publishedVersion = DbValue<int?>(reader, "PublishedVersion"),
            owner = DbValue<string>(reader, "OwnerId"),
            type = DbValue<string>(reader, "Type"),
            author = DbValue<string>(reader, "Author"),
            visibility = DbValue<string>(reader, "Visibility"),
            editors = DbJson<string[]>(reader, "Editors")
        };
    }

    public static LibraryEntryViewModel ToViewModel(SqlDataReader reader)
    {
        return new LibraryEntryViewModel
        {
            EntryId = DbValue<string>(reader, "EntryId"),
            Version = DbValue<int>(reader, "Version"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            Type = DbValue<string>(reader, "Type"),
            Title = DbValue<string>(reader, "Title"),
            Description = DbValue<string>(reader, "Description"),
            Status = DbValue<string>(reader, "Status"),
            AuthorId = DbValue<string>(reader, "Author"),
            Visibility = DbValue<string>(reader, "Visibility"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified")
        };
    }
}