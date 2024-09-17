
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class ContentResourceTransformer : SqlHelpers
{
    public static List<ContentResource> ToList(SqlDataReader reader)
    {
        var results = new List<ContentResource>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static ContentResource ToModel(SqlDataReader reader)
    {
        return new ContentResource
        {
            Id = DbValue<string>(reader, "Id"),
            OwnerId = DbValue<string>(reader, "OwnerId"),
            ParentId = DbValue<string>(reader, "ParentId"),
            Name = DbValue<string>(reader, "Name"),
            Type = DbValue<string>(reader, "Type"),
            Order = DbValue<int>(reader, "Order"),
            CreatedOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            Resource = DbValue<string>(reader, "Resource"),
            Description = DbValue<string>(reader, "Description"),
            Visibility = DbValue<string>(reader, "Visibility"),
        };
    }
}