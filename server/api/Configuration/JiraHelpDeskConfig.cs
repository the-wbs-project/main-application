using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class JiraHelpDeskConfig : IJiraHelpDeskConfig
{
    public JiraHelpDeskConfig(IConfiguration config)
    {
        Domain = config["Jira:HelpDesk:Domain"];
        LaunchToken = config["Jira:HelpDesk:LaunchToken"];

        var accessToken = config["Jira:HelpDesk:AccessToken"];
        var token = "chriswalton@cwsoftware.biz:" + accessToken;
        var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);

        AccessToken = Convert.ToBase64String(tokenBytes);

    }

    public string Domain { get; private set; }
    public string AccessToken { get; private set; }
    public string LaunchToken { get; private set; }

}