using Newtonsoft.Json;

namespace Wbs.Api.Models;

public class Member
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("email")]
    public string Email { get; set; }

    [JsonProperty("roles")]
    public IEnumerable<string> Roles { get; set; }
}