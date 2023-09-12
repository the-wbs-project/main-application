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

    public async Task<List<Invite>> GetAllAsync(string organization)
    {
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

            results.AddRange(invites.Select(Convert));

            keepGoing = invites.Count() == size;
        }
        return results;
    }


    public async Task<Invite> SendAsync(string organization, InviteBody inviteBody)
    {
        var client = await GetClientAsync();

        var invite = await client.Organizations.CreateInvitationAsync(organization, new OrganizationCreateInvitationRequest
        {
            Invitee = new OrganizationInvitationInvitee { Email = inviteBody.invitee },
            Inviter = new OrganizationInvitationInviter { Name = inviteBody.inviter },
            Roles = inviteBody.roles,
            ClientId = config.ClientId,
            SendInvitationEmail = true,
        });

        return Convert(invite);
    }

    private static Invite Convert(OrganizationInvitation invite) => new Invite
    {
        Id = invite.Id,
        CreatedAt = invite.CreatedAt,
        ExpiresAt = invite.ExpiresAt,
        Inviter = invite.Inviter.Name,
        Invitee = invite.ConnectionId,
        Roles = invite.Roles.ToArray(),
    };
}
