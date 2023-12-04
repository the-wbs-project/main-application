namespace Wbs.Api.Models;

public class LibraryEntry
{
    public string id { get; set; }
    public string owner { get; set; }
    public int publishedVersion { get; set; }
    public string createdBy { get; set; }
    public DateTimeOffset createdOn { get; set; }
    public DateTimeOffset lastModified { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public int visibility { get; set; }
}
