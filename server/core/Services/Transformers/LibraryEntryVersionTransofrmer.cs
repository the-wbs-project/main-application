
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class LibraryEntryVersionTransformer : SqlHelpers
{
    public static IEnumerable<LibraryEntryVersion> ToList(SqlDataReader reader)
    {
        while (reader.Read())
            yield return ToModel(reader);
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
            Editors = DbJson<string[]>(reader, "Editors"),
            Disciplines = DbJson<Category[]>(reader, "Disciplines"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
        };
    }
}
