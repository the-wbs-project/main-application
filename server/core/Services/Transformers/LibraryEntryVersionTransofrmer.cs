
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class LibraryEntryVersionTransformer : SqlHelpers
{
    public static IEnumerable<LibraryEntryVersion> ToList(SqlDataReader reader)
    {
        var list = new List<LibraryEntryVersion>();

        while (reader.Read())
            list.Add(ToModel(reader));

        return list;
    }

    public static LibraryEntryVersion ToModel(SqlDataReader reader)
    {
        return new LibraryEntryVersion
        {
            EntryId = DbValue<string>(reader, "EntryId"),
            Version = DbValue<int>(reader, "Version"),
            VersionAlias = DbValue<string>(reader, "VersionAlias"),
            Author = DbValue<string>(reader, "Author"),
            Title = DbValue<string>(reader, "Title"),
            Description = DbValue<string>(reader, "Description"),
            Status = DbValue<string>(reader, "Status"),
            Categories = DbJson<string[]>(reader, "Categories"),
            Disciplines = DbJson<Category[]>(reader, "Disciplines"),
            ReleaseNotes = DbValue<string>(reader, "ReleaseNotes"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
        };
    }
}
