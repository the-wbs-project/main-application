namespace Wbs.Api.Models;

public class ProjectToLibraryOptions
{
    public string author { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public bool includeResources { get; set; }
    public string[] categories { get; set; }
    public string visibility { get; set; }
}