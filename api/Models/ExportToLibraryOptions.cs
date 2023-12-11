namespace Wbs.Api.Models;

public class ExportToLibraryOptions
{
    public string author { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public bool includeResources { get; set; }
    public int visibility { get; set; }
}