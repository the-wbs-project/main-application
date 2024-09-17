namespace Wbs.Core.Models;

public class ProjectNodeToLibraryOptions
{
    public string alias { get; set; }
    public string author { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public bool includeResources { get; set; }
    public object phase { get; set; }
    public string visibility { get; set; }
}
