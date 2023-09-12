namespace Wbs.Api.Models;

public class InviteBody
{
  public string inviter { get; set; }
  public string invitee { get; set; }
  public string[] roles { get; set; }
}

public class Invite
{
  public string inviter { get; set; }
  public string invitee { get; set; }
  public string[] roles { get; set; }
  public string Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime ExpiresAt { get; set; }
  public string Inviter { get; set; }
  public string Invitee { get; set; }
  public string[] Roles { get; set; }
}
