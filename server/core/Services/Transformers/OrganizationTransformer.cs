using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

public class OrganizationTransformer : SqlHelpers
{
    public static List<Organization> ToModelList(SqlDataReader reader)
    {
        var results = new List<Organization>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static Organization ToModel(SqlDataReader reader)
    {
        return new Organization
        {
            Id = DbValue<string>(reader, "Id"),
            Name = DbValue<string>(reader, "Name"),
            AiModels = DbJson<OrganizationAiConfiguration>(reader, "AiModels"),
            CreatedAt = DbValue<DateTimeOffset>(reader, "CreatedAt"),
            UpdatedAt = DbValue<DateTimeOffset>(reader, "UpdatedAt")
        };
    }
}