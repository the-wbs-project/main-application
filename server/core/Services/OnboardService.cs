using Auth0.ManagementApi.Models;
using Microsoft.Extensions.Logging;
using Wbs.Core.DataServices;
using Wbs.Core.Models;
using Wbs.Core.ViewModels;

public class OnboardService
{
    private readonly DataServiceFactory data;
    private readonly ILogger<OnboardService> _logger;

    public OnboardService(DataServiceFactory data, ILoggerFactory logger)
    {
        this.data = data;
        _logger = logger.CreateLogger<OnboardService>();
    }

    public async Task<OnboardingRecord> GetRecordAsync(string organizationId, string inviteId)
    {
        var conn = await data.CreateConnectionAsync();
        var invite = await data.Invites.GetByIdAsync(conn, organizationId, inviteId);

        if (invite == null) return null;

        var user = await data.Users.GetByEmailAsync(invite.Email);

        return new OnboardingRecord
        {
            InviteId = invite.Id,
            Email = invite.Email,
            OrganizationId = invite.OrganizationId,
            Roles = invite.Roles,
            InviteStatus = invite.Cancelled ? "Cancelled" : user != null ? "Completed" : "Active",
            UserId = user?.UserId
        };
    }

    public async Task<User> OnboardAsync(string organizationId, string inviteId, OnboardingResults results)
    {
        var conn = await data.CreateConnectionAsync();
        var invite = await data.Invites.GetByIdAsync(conn, organizationId, inviteId);

        if (invite == null) return null;

        var user = await data.Users.CreateAsync(new UserViewModel
        {
            Email = invite.Email,
            FullName = results.FullName,
            Title = results.Title,
            LinkedIn = results.LinkedIn,
            Twitter = results.Twitter,
            Picture = results.Picture,
            ShowExternally = results.ShowExternally,
        }, results.Password);
        //
        //  Add the roles for the user.
        //
        await data.OrganizationRoles.SetRolesAsync(conn, invite.OrganizationId, user.UserId, invite.Roles);
        //
        //  Update the invite
        //
        invite.SignupDate = DateTime.UtcNow;

        await data.Invites.UpdateAsync(conn, invite);

        return user;
    }
}
