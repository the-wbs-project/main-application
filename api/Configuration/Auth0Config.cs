namespace Wbs.Api.Configuration;

public class Auth0Config
{
    public Auth0Config(string domain, string audience, string clientId, string connection, string m2MClientId, string m2MClientSecret)
    {
        Domain = domain;
        Audience = audience;
        ClientId = clientId;
        Connection = connection;
        M2MClientId = m2MClientId;
        M2MClientSecret = m2MClientSecret;
    }

    public string Domain { get; private set; }
    public string Audience { get; private set; }
    public string ClientId { get; private set; }
    public string Connection { get; private set; }
    public string M2MClientId { get; private set; }
    public string M2MClientSecret { get; set; }
}