namespace Wbs.Core.Models;

public class ProjectApproval
{
    public string id { get; set; }
    public string projectId { get; set; }
    public DateTimeOffset? approvedOn { get; set; }
    public bool? isApproved { get; set; }
    public string approvedBy { get; set; }
}
