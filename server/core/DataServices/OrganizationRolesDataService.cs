using System.Data;
using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class OrganizationRolesDataService : BaseSqlDbService
{
    public async Task<List<string>> GetMemberIdsAsync(SqlConnection conn, string organizationId)
    {
        var cmd = new SqlCommand("SELECT DISTINCT [UserId] FROM [dbo].[OrganizationRoles] WHERE [OrganizationId] = @OrganizationId", conn);

        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);

        using var reader = await cmd.ExecuteReaderAsync();

        var results = new List<string>();

        while (reader.Read())
            results.Add(reader.GetString(0));

        return results;
    }
    public async Task<Dictionary<string, List<string>>> GetMembershipsAsync(SqlConnection conn, string userId)
    {
        var cmd = new SqlCommand("SELECT [OrganizationId], [Role] FROM [dbo].[OrganizationRoles] WHERE [UserId] = @UserId", conn);

        cmd.Parameters.AddWithValue("@UserId", userId);

        using var reader = await cmd.ExecuteReaderAsync();

        var results = new Dictionary<string, List<string>>();

        while (reader.Read())
        {
            var orgId = reader.GetString(0);
            var role = reader.GetString(1);

            if (results.ContainsKey(orgId))
            {
                results[orgId].Add(role);
            }
            else
            {
                results.Add(orgId, [role]);
            }
        }
        return results;
    }

    public async Task<OrganizationRole[]> GetAllAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("SELECT [OrganizationId], [UserId], [Role] FROM [dbo].[OrganizationRoles]", conn);

        using var reader = await cmd.ExecuteReaderAsync();

        var roles = new List<OrganizationRole>();

        while (reader.Read())
            roles.Add(new OrganizationRole { OrganizationId = reader.GetString(0), UserId = reader.GetString(1), Role = reader.GetString(2) });

        return roles.ToArray();
    }

    public async Task<UserRole[]> GetOrganizationalRolesAsync(SqlConnection conn, string organizationId)
    {
        var cmd = new SqlCommand("SELECT [UserId], [Role] FROM [dbo].[OrganizationRoles] WHERE [OrganizationId] = @OrganizationId", conn);

        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);

        using var reader = await cmd.ExecuteReaderAsync();

        var roles = new List<UserRole>();

        while (reader.Read())
            roles.Add(new UserRole { UserId = reader.GetString(0), Role = reader.GetString(1) });

        return roles.ToArray();
    }

    public async Task SetRolesAsync(SqlConnection conn, string organizationId, string userId, IEnumerable<string> roles)
    {
        var cmd = new SqlCommand("dbo.OrganizationRoles_Set", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@OrganizationId", organizationId);
        cmd.Parameters.AddWithValue("@UserId", userId);
        cmd.Parameters.AddWithValue("@Roles", DbJson(roles));

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<UserRole>> GetSiteRolesAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("SELECT [UserId], [Role] FROM [dbo].[SiteRoles]", conn);

        using var reader = await cmd.ExecuteReaderAsync();

        var roles = new List<UserRole>();

        while (reader.Read())
            roles.Add(new UserRole { UserId = reader.GetString(0), Role = reader.GetString(1) });

        return roles.ToList();
    }
}