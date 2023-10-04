using System.Text.Json.Serialization;

namespace Wbs.Api.Models;

public class JiraOrganization
{
    public string id { get; set; }
    public string name { get; set; }
    public JiraLinks _links { get; set; }
}