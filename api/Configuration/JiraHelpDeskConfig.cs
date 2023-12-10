namespace Wbs.Api.Configuration;

public class JiraHelpDeskConfig
{
    public JiraHelpDeskConfig(string domain, string launchToken, string accessToken)
    {
        Domain = domain;
        LaunchToken = launchToken;

        var token = "chriswalton@cwsoftware.biz:" + accessToken;
        var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);

        AccessToken = Convert.ToBase64String(tokenBytes);

    }

    public string Domain { get; private set; }
    public string AccessToken { get; private set; }
    public string LaunchToken { get; private set; }

}