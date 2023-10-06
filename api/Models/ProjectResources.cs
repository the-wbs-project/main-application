namespace Wbs.Api.Models;

public class ProjectResource
{
    public string Id { get; set; }
    public string ProjectId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public int Order { get; set; }
    public string Resource { get; set; }
    public string Description { get; set; }
}
