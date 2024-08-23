namespace Wbs.Core.ViewModels;

public class LibraryDraftViewModel
{
    public string OwnerId { get; set; }
    public string EntryId { get; set; }
    public string RecordId { get; set; }
    public string Type { get; set; }
    public int Version { get; set; }
    public string VersionAlias { get; set; }
    public string AuthorId { get; set; }
    public string Title { get; set; }
    public string Visibility { get; set; }
    public DateTimeOffset LastModified { get; set; }
}
