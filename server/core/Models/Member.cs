using Auth0.ManagementApi.Models;

namespace Wbs.Core.Models;

public class Member
{
    public Member() { }
    public Member(User user)
    {
        Id = user.UserId;
        Name = user.FullName;
        Email = user.Email;
        Picture = user.Picture;
        CreatedAt = user.CreatedAt;
        LastLogin = user.LastLogin;

        if (!string.IsNullOrEmpty(user.LoginsCount)
            && int.TryParse(user.LoginsCount, out var loginCount))
        {
            LoginCount = loginCount;
        }
    }

    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Picture { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public int? LoginCount { get; set; }
    public List<string> Roles { get; set; }
}