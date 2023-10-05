using System.Text.Json.Serialization;

namespace Wbs.Api.Models;

public class JiraServiceDesk
{
    public string id { get; set; }
    public string projectId { get; set; }
    public string projectName { get; set; }
    public string projectKey { get; set; }
    public JiraLinks _links { get; set; }
}