using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;

namespace Wbs.Core.Services;

public class AuthConverterService : BaseAuthDataService
{
    private readonly DataServiceFactory data;

    public AuthConverterService(DataServiceFactory data, ILoggerFactory loggerFactory, IAuth0Config config) : base(loggerFactory.CreateLogger<AuthConverterService>(), config)
    {
        this.data = data;
    }

    public async Task Run()
    {
        using var conn = await data.CreateConnectionAsync();
        var client = await GetClientAsync();
        var organizations = (await client.Organizations.GetAllAsync(new PaginationInfo())).ToList();
        var users = await GetUsers(client);
        var siteAdmin = await GetSiteAdmin(client);

        foreach (var org in organizations)
        {
            await data.Organizations.SetAsync(conn, new Models.Organization
            {
                Id = org.Name,
                Name = org.DisplayName,
                AiModels = new Models.OrganizationAiConfiguration
                {
                    Choice = "all"
                }
            });
        }

        await SaveSiteRoles(conn, siteAdmin);

        foreach (var user in users)
        {
            if (!(user.EmailVerified ?? false)) continue;

            var userOrgs = await client.Users.GetAllOrganizationsAsync(user.UserId, new PaginationInfo());

            foreach (var org in userOrgs)
            {
                var roles = await GetOrgRoles(client, org.Id, user.UserId);

                if (roles.Count > 0)
                {
                    roles.Insert(0, "member");
                }

                await data.OrganizationRoles.SetRolesAsync(conn, org.Name, user.UserId, roles);
            }
        }
    }

    private async Task<List<User>> GetUsers(ManagementApiClient client)
    {
        var users = await client.Users.GetAllAsync(new GetUsersRequest(), new PaginationInfo(0, 100));

        return users.ToList();
    }

    private async Task<List<string>> GetOrgRoles(ManagementApiClient client, string organizationId, string userId)
    {
        var data = await client.Organizations.GetAllMemberRolesAsync(organizationId, userId, new PaginationInfo());

        return data.Select(x => x.Name).ToList();
    }

    private async Task<List<string>> GetSiteAdmin(ManagementApiClient client)
    {
        var roles = await client.Roles.GetAllAsync(new GetRolesRequest());
        var roleId = roles.Where(x => x.Name == "site_admin").First().Id;

        logger.LogWarning("Role ID: " + roleId);

        var data = await client.Roles.GetUsersAsync(roleId);

        return data.Select(x => x.UserId).ToList();
    }

    private async Task SaveSiteRoles(SqlConnection conn, List<string> userIds)
    {
        var cmd = new SqlCommand("INSERT INTO [dbo].[SiteRoles] VALUES (@UserId, 'site_admin')", conn);

        var param = cmd.Parameters.AddWithValue("@UserId", "");

        foreach (var userId in userIds)
        {
            param.Value = userId;

            await cmd.ExecuteNonQueryAsync();
        }
    }
}