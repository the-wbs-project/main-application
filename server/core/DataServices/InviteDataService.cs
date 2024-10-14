using Microsoft.Data.SqlClient;
using System.Data;
using Wbs.Core.Models;
using Wbs.Core.Services.Transformers;

namespace Wbs.Core.DataServices;

public class InviteDataService : BaseSqlDbService
{
    public async Task<List<Invite>> GetAsync(SqlConnection conn, string organizationId, bool includeAll)
    {
        var query = "SELECT * FROM [dbo].[Invites] WHERE [OrganizationId] = @OrganizationId";

        if (!includeAll)
        {
            query += " AND [SignupDate] IS NULL AND [Cancelled] = 0";
        }

        var cmd = new SqlCommand(query, conn);

        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);

        using var reader = await cmd.ExecuteReaderAsync();

        return InviteTransformer.ToModelList(reader);
    }

    public async Task CreateAsync(SqlConnection conn, Invite invite)
    {
        var cmd = new SqlCommand("dbo.Invite_Create", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", invite.Id);
        cmd.Parameters.AddWithValue("@Email", invite.Email);
        cmd.Parameters.AddWithValue("@OrganizationId", invite.OrganizationId);
        cmd.Parameters.AddWithValue("@InvitedById", invite.InvitedById);
        cmd.Parameters.AddWithValue("@Roles", DbJson(invite.Roles));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task UpdateAsync(SqlConnection conn, Invite invite)
    {
        var cmd = new SqlCommand("dbo.Invite_Update", conn)
        {
            CommandType = CommandType.StoredProcedure
        };

        cmd.Parameters.AddWithValue("@Id", invite.Id);
        cmd.Parameters.AddWithValue("@LastInviteSentDate", invite.LastInviteSentDate);
        cmd.Parameters.AddWithValue("@SignupDate", invite.SignupDate);
        cmd.Parameters.AddWithValue("@Roles", DbJson(invite.Roles));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task CancelAsync(SqlConnection conn, string id)
    {
        var cmd = new SqlCommand("UPDATE [dbo].[Invites] SET [Cancelled] = 1 WHERE [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Id", id);

        await cmd.ExecuteNonQueryAsync();
    }
}
