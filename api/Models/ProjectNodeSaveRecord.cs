namespace Wbs.Api.Models;

public class ProjectNodeSaveRecord
{
    public ProjectNode[] upserts { get; set; }
    public string[] removeIds { get; set; }
}
