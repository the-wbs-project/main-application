namespace Wbs.Core.Configuration;

public interface IJiraHelpDeskConfig
{
    string Domain { get; }
    string AccessToken { get; }
    string LaunchToken { get; }

}