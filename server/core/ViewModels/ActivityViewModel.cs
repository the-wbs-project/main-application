using Wbs.Core.Models;

namespace Wbs.Core.ViewModels;

public class ActivityViewModel : Activity
{
    public string actionIcon { get; set; }
    public string actionTitle { get; set; }
    public string actionDescription { get; set; }
}
