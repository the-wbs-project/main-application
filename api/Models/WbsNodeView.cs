namespace Wbs.Api.Models;

public class WbsNodeView
{
    public string id { get; set; }
    public string levelText { get; set; }
    public int order { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public List<string> disciplines { get; set; }
    public List<string> resources { get; set; }
}

