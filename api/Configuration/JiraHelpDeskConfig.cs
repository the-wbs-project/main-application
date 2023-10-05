using System.Security.Principal;

namespace Wbs.Api.Configuration;

public class JiraHelpDeskConfig
{
    public string Domain { get; set; }
    public string AccessToken { get; set; }
    public string LaunchToken { get; set; }

    public JiraHelpDeskConfig(IConfiguration fullConfig)
    {
        var config = fullConfig.GetSection("Jira").GetSection("HelpDesk");

        Domain = config["Domain"];
        LaunchToken = config["LaunchToken"];

        var token = "chriswalton@cwsoftware.biz:" + config["AccessToken"];
        var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);

        AccessToken = Convert.ToBase64String(tokenBytes);
    }
}