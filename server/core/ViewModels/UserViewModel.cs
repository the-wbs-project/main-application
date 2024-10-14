namespace Wbs.Core.ViewModels;

public partial class UserViewModel
{
    public string UserId { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string Title { get; set; }
    public string LinkedIn { get; set; }
    public string Twitter { get; set; }
    public string Picture { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int LoginCount { get; set; }
    public string Phone { get; set; }
    public string[] ShowExternally { get; set; }
}
