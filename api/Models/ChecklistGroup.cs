namespace Wbs.Api.Models;

public class ChecklistGroup
{
    public string id { get; set; }
    public int order { get; set; }
    public string description { get; set; }
    public List<ChecklistItem> items { get; set; }
}
