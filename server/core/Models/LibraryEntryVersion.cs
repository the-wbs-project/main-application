namespace Wbs.Core.Models;

public class LibraryEntryVersion
{
    public string entryId { get; set; }
    public int version { get; set; }
    public string versionAlias { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public string status { get; set; }
    public string[] categories { get; set; }
    public Category[] disciplines { get; set; }
    public DateTimeOffset lastModified { get; set; }
}
