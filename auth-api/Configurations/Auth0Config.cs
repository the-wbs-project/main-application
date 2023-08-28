namespace Wbs.AuthApi.Configurations;

public class Auth0Config
{
    public string Domain { get; set; }
    public string Audience { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }

    public Auth0Config(IConfiguration config)
    {
        Domain = config["Domain"];
        Audience = config["Audience"];
        ClientId = config["ClientId"];
        ClientSecret = config["ClientSecret"];
    }
}