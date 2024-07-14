
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class LibraryEntryVersionReviewTransformer : SqlHelpers
{
    public static List<LibraryEntryVersionReview> ToModelList(SqlDataReader reader)
    {
        var results = new List<LibraryEntryVersionReview>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static LibraryEntryVersionReview ToModel(SqlDataReader reader)
    {
        return new LibraryEntryVersionReview
        {
            Id = DbValue<string>(reader, "Id"),
            Author = DbValue<string>(reader, "Author"),
            Timestamp = DbValue<DateTimeOffset>(reader, "LastModified"),
            Anonymous = DbValue<bool>(reader, "Anonymous"),
            Rating = DbValue<int>(reader, "Rating"),
            Comment = DbValue<string>(reader, "Comment")
        };
    }
}