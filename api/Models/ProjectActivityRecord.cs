namespace Wbs.Api.Models;

public class ProjectActivityRecord
{
    public Activity activity { get; set; }
    public Project project { get; set; }
    public ProjectNode[] nodes { get; set; }
}
