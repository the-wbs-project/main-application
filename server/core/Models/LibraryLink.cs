namespace Wbs.Core.Models;

public class LibraryLink
{
    public string owner { get; set; }
    public string entryId { get; set; }
    public int version { get; set; }
}

public class LibraryTaskLink
{
    public string owner { get; set; }
    public string entryId { get; set; }
    public int version { get; set; }
    public string taskId { get; set; }
}
