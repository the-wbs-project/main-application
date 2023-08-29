namespace Wbs.Api.Models;

public class Activity
{
    public string id { get; set; }
    public string action { get; set; }
    public DateTime timestamp { get; set; }
    public string userId { get; set; }
    public string topLevelId { get; set; }
    public string objectId { get; set; }
    public string versionId { get; set; }
    public Dictionary<string, object> data { get; set; }
}
