namespace Wbs.Api.Configurations;

public class Auth0Config
{
    public string Domain { get; set; }
    public string Audience { get; set; }
    public string ClientId { get; set; }
    public string Connection { get; set; }
    public string M2MClientId { get; set; }
    public string M2MClientSecret { get; set; }

    public Auth0Config(IConfiguration config)
    {
        Domain = config["Domain"];
        Audience = config["Audience"];
        ClientId = config["ClientId"];
        Connection = config["Connection"];
        M2MClientId = config["M2MClientId"];
        M2MClientSecret = config["M2MClientSecret"];
    }
}