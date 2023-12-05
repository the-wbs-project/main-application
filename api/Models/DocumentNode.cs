namespace Wbs.Api.Models;

public class DocumentNode
{
    public int order { get; set; }
    public string level { get; set; }
    public string text { get; set; }
    public List<DocumentNode> children { get; set; }
}
