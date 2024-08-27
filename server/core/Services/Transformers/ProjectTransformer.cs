
using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class ProjectTransformer : SqlHelpers
{
    public static List<Project> ToModelList(SqlDataReader reader)
    {
        var results = new List<Project>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static Project ToModel(SqlDataReader reader)
    {
        return new Project
        {
            Id = DbValue<string>(reader, "Id"),
            RecordId = DbValue<string>(reader, "RecordId"),
            Owner = DbValue<string>(reader, "OwnerId"),
            CreatedBy = DbValue<string>(reader, "CreatedBy"),
            CreatedOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            LastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            Title = DbValue<string>(reader, "Title"),
            Description = DbValue<string>(reader, "Description"),
            Status = DbValue<string>(reader, "Status"),
            MainNodeView = DbValue<string>(reader, "MainNodeView"),
            Category = DbValue<string>(reader, "Category"),

            Disciplines = DbJson<Category[]>(reader, "Disciplines"),
            Roles = DbJson<ProjectRole[]>(reader, "Roles"),
            LibraryLink = DbJson<LibraryLink>(reader, "LibraryLink"),

            ApprovalStarted = DbValue<bool?>(reader, "ApprovalStarted"),
        };
    }
}