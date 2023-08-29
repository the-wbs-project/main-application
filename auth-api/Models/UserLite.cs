using Newtonsoft.Json;

namespace Wbs.AuthApi.Controllers;

public class UserLite
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("email")]
    public string Email { get; set; }
}