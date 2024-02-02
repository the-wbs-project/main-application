namespace Wbs.Api.Models;

public class LibraryEntry
{
    public string id { get; set; }
    public string owner { get; set; }
    public int? publishedVersion { get; set; }
    public string type { get; set; }
    public string author { get; set; }
    public string visibility { get; set; }
    public string[] editors { get; set; }
}
