namespace Wbs.Core.Models;

public class OnboardingRecord
{
    public string InviteId { get; set; }
    public string Email { get; set; }
    public string OrganizationId { get; set; }
    public string InviteStatus { get; set; }
    public string UserId { get; set; }
    public string[] Roles { get; set; }
}
