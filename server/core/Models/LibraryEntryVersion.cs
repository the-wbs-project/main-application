namespace Wbs.Core.Models;

public class LibraryEntryVersion
{
    public string EntryId { get; set; }
    public int Version { get; set; }
    public string VersionAlias { get; set; }
    public string Author { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string[] Categories { get; set; }
    public string[] Editors { get; set; }
    public Category[] Disciplines { get; set; }
    public DateTimeOffset LastModified { get; set; }
}
