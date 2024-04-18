namespace Wbs.Core.ViewModels;

public class LibraryEntryViewModel
{
    public string OwnerId { get; set; }
    public string EntryId { get; set; }
    public int Version { get; set; }
    public string Author { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Type { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string Status { get; set; }
    public string Visibility { get; set; }
}
