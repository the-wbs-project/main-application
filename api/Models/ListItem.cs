namespace Wbs.Api.Models;

public class ListItem
{
    public string id { get; set; }
    public string type { get; set; }
    public string label { get; set; }
    public int order { get; set; }
    public string icon { get; set; }
    public string sameAs { get; set; }
    public string description { get; set; }
    public List<string> tags { get; set; }
}

