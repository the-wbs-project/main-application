using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Transformers;

public class InviteTransformer : SqlHelpers
{
    public static List<Invite> ToModelList(SqlDataReader reader)
    {
        var results = new List<Invite>();

        while (reader.Read())
            results.Add(ToModel(reader));

        return results;
    }

    public static Invite ToModel(SqlDataReader reader)
    {
        return new Invite
        {
            Id = DbValue<string>(reader, "Id"),
            Email = DbValue<string>(reader, "Email"),
            OrganizationId = DbValue<string>(reader, "OrganizationId"),
            InvitedById = DbValue<string>(reader, "InvitedById"),
            CreationDate = DbValue<DateTimeOffset>(reader, "CreationDate"),
            LastModifiedDate = DbValue<DateTimeOffset>(reader, "LastModifiedDate"),
            LastInviteSentDate = DbValue<DateTimeOffset?>(reader, "LastInviteSentDate"),
            SignupDate = DbValue<DateTimeOffset?>(reader, "SignupDate"),
            Roles = DbJson<string[]>(reader, "Roles"),
            Cancelled = DbValue<bool>(reader, "Cancelled"),
        };
    }
}