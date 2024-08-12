
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

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

    public static LibraryEntry ToModel(SqlDataReader reader)
    {
        return new LibraryEntry
        {
            Id = DbValue<string>(reader, "Id"),
            PublishedVersion = DbValue<int?>(reader, "PublishedVersion"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            Type = DbValue<string>(reader, "Type"),
            Visibility = DbValue<string>(reader, "Visibility")
        };
    }
}