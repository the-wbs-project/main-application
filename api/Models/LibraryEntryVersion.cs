namespace Wbs.Api.Models;

public class LibraryEntryVersion
{
    public string entryId { get; set; }
    public int version { get; set; }
    public string status { get; set; }
    public string[] categories { get; set; }
    public object[] phases { get; set; }
    public object[] disciplines { get; set; }
}
