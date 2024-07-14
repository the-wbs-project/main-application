namespace Wbs.Core.Models;

public class LibraryEntryVersionReview
{
    public string Id { get; set; }
    public string Author { get; set; }
    public DateTimeOffset Timestamp { get; set; }
    public bool Anonymous { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}
