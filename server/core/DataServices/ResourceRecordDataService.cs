using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class ResourceRecordDataService : BaseSqlDbService
{
    protected async Task<List<ResourceRecord>> ToList(SqlCommand cmd)
    {
        var results = new List<ResourceRecord>();

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    protected ResourceRecord ToModel(SqlDataReader reader)
    {
        return new ResourceRecord
        {
            Id = DbValue<string>(reader, "Id"),
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
