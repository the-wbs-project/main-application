namespace Wbs.Core.Models;

public class InviteBody
{
  public string Inviter { get; set; }
  public string Invitee { get; set; }
  public string[] Roles { get; set; }
}

public class Invite
{
  public string Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime ExpiresAt { get; set; }
  public string Inviter { get; set; }
  public string Invitee { get; set; }
  public string[] Roles { get; set; }
}
