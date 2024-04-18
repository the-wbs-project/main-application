namespace Wbs.Core.Models;

public class ProjectNodeToLibraryOptions
{
    public string author { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public bool includeResources { get; set; }
    public string[] categories { get; set; }
    public object phase { get; set; }
    public string visibility { get; set; }
}
