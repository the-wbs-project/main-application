namespace Wbs.Core.Models;

public class Activity
{
    public string id { get; set; }
    public string action { get; set; }
    public DateTimeOffset timestamp { get; set; }
    public string userId { get; set; }
    public string topLevelId { get; set; }
    public string objectId { get; set; }
    public int? versionId { get; set; }
    public Dictionary<string, object> data { get; set; }
}
