namespace Wbs.Api.Models;

public class ResourceObject
{
    public string section { get; set; }
    public string locale { get; set; }
    public Dictionary<string, string> values { get; set; }
}
