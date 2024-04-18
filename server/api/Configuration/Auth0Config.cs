using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class Auth0Config : IAuth0Config
{
    public Auth0Config(IConfiguration config)
    {
        Domain = config["Auth0:Domain"];
        Audience = config["Auth0:Audience"];
        ClientId = config["Auth0:ClientId"];
        Connection = config["Auth0:Connection"];
        M2MClientId = config["Auth0:M2MClientId"];
        M2MClientSecret = config["Auth0:M2MClientSecret"];
    }

    public string Domain { get; private set; }
    public string Audience { get; private set; }
    public string ClientId { get; private set; }
    public string Connection { get; private set; }
    public string M2MClientId { get; private set; }
    public string M2MClientSecret { get; private set; }
}