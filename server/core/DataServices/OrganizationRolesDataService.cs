using Microsoft.Data.SqlClient;

namespace Wbs.Core.DataServices;

public class OrganizationRolesDataService : BaseSqlDbService
{
    public async Task<string[]> GetRolesAsync(SqlConnection conn, string organizationId, string userId)
    {
        var cmd = new SqlCommand("SELECT [Role] FROM [dbo].[OrganizationRoles] WHERE [OrganizationId] = @OrganizationId AND [UserId] = @UserId", conn);

        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);
        cmd.Parameters.AddWithValue("@UserId", userId);

        using var reader = await cmd.ExecuteReaderAsync();

        var roles = new List<string>();

        while (reader.Read())
            roles.Add(reader.GetString(0));

        return roles.ToArray();
    }

    public async Task SetRolesAsync(SqlConnection conn, string organizationId, string userId, string[] roles)
    {
        var cmd = new SqlCommand("dbo.OrganizationRoles_Set", conn);

        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);
        cmd.Parameters.AddWithValue("@UserId", userId);
        cmd.Parameters.AddWithValue("@Roles", DbJson(roles));

        await cmd.ExecuteNonQueryAsync();
    }
}