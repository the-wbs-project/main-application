namespace Wbs.Core.Models;

public class LibraryEntry
{
    public string Id { get; set; }
    public string OwnerId { get; set; }
    public string RecordId { get; set; }
    public int? PublishedVersion { get; set; }
    public string Type { get; set; }
    public string Visibility { get; set; }
}
