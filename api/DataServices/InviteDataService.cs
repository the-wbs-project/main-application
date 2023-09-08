using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class InviteDataService : BaseAuthDataService
{
    private readonly ILogger<InviteDataService> logger;

    public InviteDataService(ILogger<InviteDataService> logger, IConfiguration config) : base(logger, config)
    {
        this.logger = logger;
    }

    public async Task<List<Invite>> GetPageAsync(string organization)
    {
        await EnsureRolesAsync();

        var page = 0;
        var size = 100;
        var keepGoing = true;
        var client = await GetClientAsync();
        var results = new List<Invite>();

        while (keepGoing)
        {
            var pageInfo = new PaginationInfo(page, size, false);
            var request = new OrganizationGetAllInvitationsRequest
            {
                Sort = "created_at:1",
            };
            var invites = await client.Organizations.GetAllInvitationsAsync(organization, request, pageInfo);

            results.AddRange(invites
                .Select(i => new Invite
                {
                    Id = i.Id,
                    CreatedAt = i.CreatedAt,
                    ExpiresAt = i.ExpiresAt,
                    Inviter = i.Inviter.Name,
                    Invitee = i.Invitee.Email,
                    Roles = i.Roles.ToArray(),
                }));

            keepGoing = invites.Count() == size;
        }
        return results;
    }


    public async Task SendAsync(string organization, InviteBody invite)
    {
        await EnsureRolesAsync();

        invite.roles = invite.roles
            .Select(role => this.roles[role])
            .ToArray();

        var client = await GetClientAsync();

        await client.Organizations.CreateInvitationAsync(organization, new OrganizationCreateInvitationRequest
        {
            Invitee = new OrganizationInvitationInvitee { Email = invite.invitee },
            Inviter = new OrganizationInvitationInviter { Name = invite.inviter },
            Roles = invite.roles,
        });
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
