namespace Wbs.Core.Models;

public class Invite
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string OrganizationId { get; set; }
    public string InvitedById { get; set; }
    public DateTimeOffset? CreationDate { get; set; }
    public DateTimeOffset? LastModifiedDate { get; set; }
    public DateTimeOffset? LastInviteSentDate { get; set; }
    public DateTimeOffset? SignupDate { get; set; }
    public string[] Roles { get; set; }
    public bool Cancelled { get; set; }
}
