namespace Wbs.Api.Models;

public class ChecklistItem
{
    public string id { get; set; }
    public int order { get; set; }
    public string description { get; set; }
    public string type { get; set; }
    public string path { get; set; }
    public ChecklistTest pass { get; set; }
    public ChecklistTest warn { get; set; }
}

public class ChecklistTest
{
    public string op { get; set; }
    public double value { get; set; }
}