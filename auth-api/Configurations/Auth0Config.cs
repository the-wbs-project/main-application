namespace Wbs.AuthApi.Configurations;

public class Auth0Config
{
    public string Domain { get; set; }
    public string Audience { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }

    public Auth0Config(IConfiguration config)
    {
        Domain = config["Auth0:Domain"];
        Audience = config["Auth0:Audience"];
        ClientId = config["Auth0:ClientId"];
        ClientSecret = config["Auth0:ClientSecret"];
    }
}