using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;

namespace Wbs.Api.Services;

public class OrganizationDataService : BaseAuthDataService
{
    private readonly ILogger<OrganizationDataService> logger;
    protected Dictionary<string, string> orgIds = new Dictionary<string, string>();

    public OrganizationDataService(ILogger<OrganizationDataService> logger, IConfiguration config) : base(logger, config)
    {
        this.logger = logger;
    }

    public async Task<string> GetOrganizationIdByNameAsync(string orgName)
    {
        if (orgIds.ContainsKey(orgName))
            return orgIds[orgName];

        var client = await GetClientAsync();
        var org = await client.Organizations.GetByNameAsync(orgName);

        orgIds.Add(orgName, org.Id);

        return org.Id;
    }

    public async Task<IEnumerable<OrganizationMember>> GetOrganizationalUsersAsync(string organization)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        return await client.Organizations.GetAllMembersAsync(organization, page);
    }

    public async Task<IEnumerable<string>> GetUserOrganizationalRolesAsync(string organization, string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        var roles = await client.Organizations.GetAllMemberRolesAsync(organization, userId, page);

        return roles.Select(r => r.Name);
    }

    public async Task AddUserOrganizationalRolesAsync(string organization, string userId, IEnumerable<string> roles)
    {
        await EnsureRolesAsync();

        var client = await GetClientAsync();
        var ids = roles.Select(id => this.roles[id]).ToArray();

        await client.Organizations.AddMemberRolesAsync(organization, userId, new OrganizationAddMemberRolesRequest { Roles = ids });
    }

    public async Task RemoveUserOrganizationalRolesAsync(string organization, string userId, IEnumerable<string> roles)
    {
        await EnsureRolesAsync();

        var client = await GetClientAsync();
        var ids = roles.Select(id => this.roles[id]).ToArray();

        await client.Organizations.DeleteMemberRolesAsync(organization, userId, new OrganizationDeleteMemberRolesRequest { Roles = ids });
    }

    public Task RemoveUserFromOrganizationAsync(string organization, string user) => RemoveUserFromOrganizationAsync(organization, new string[] { user });

    public async Task RemoveUserFromOrganizationAsync(string organization, string[] users)
    {
        var client = await GetClientAsync();

        await client.Organizations.DeleteMemberAsync(organization, new OrganizationDeleteMembersRequest { Members = users });
    }
}
