namespace Wbs.Core.Models;

public abstract class BaseNode
{
    public string id { get; set; }
    public string parentId { get; set; }
    public string title { get; set; }
    public int order { get; set; }
    public DateTimeOffset? createdOn { get; set; }
    public DateTimeOffset? lastModified { get; set; }
    public string description { get; set; }
    public string phaseIdAssociation { get; set; }
    public string[] disciplineIds { get; set; }
}
