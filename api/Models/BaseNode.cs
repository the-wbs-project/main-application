namespace Wbs.Api.Models;

public abstract class BaseNode
{
    public string id { get; set; }
    public string parentId { get; set; }
    public string title { get; set; }
    public int order { get; set; }
    public bool removed { get; set; }
    public DateTimeOffset? createdOn { get; set; }
    public DateTimeOffset? lastModified { get; set; }
    public string description { get; set; }
    public string[] disciplineIds { get; set; }
}
