
namespace Wbs.Api.Configuration;

public class AppConfig
{
    public AppConfig(IConfiguration config)
    {
        Auth0 = new Auth0Config(
            config["Auth0:Domain"],
            config["Auth0:Audience"],
            config["Auth0:ClientId"],
            config["Auth0:Connection"],
            config["Auth0:M2MClientId"],
            config["Auth0:M2MClientSecret"]);

        Database = new DatabaseConfig(
            config["Db:ConnectionString:Sql"],
            config["Db:ConnectionString:Cosmos"]);

        DocumentAi = new AzureAiDocumentConfig(
            config["Azure:AI:Document:Endpoint"],
            config["Azure:AI:Document:Key"],
            config["Azure:AI:Document:LogDatabase"]);

        SearchAi = new AzureAiSearchConfig(
            config["Azure:AI:Search:Url"],
            config["Azure:AI:Search:Key"],
            config["Azure:AI:Search:LibraryIndex"],
            config["Azure:AI:Search:ProjectIndex"]);

        Jira = new JiraHelpDeskConfig(
            config["Jira:HelpDesk:Domain"],
            config["Jira:HelpDesk:LaunchToken"],
            config["Jira:HelpDesk:AccessToken"]);

        Storage = new StorageConfig(
            config["Blobs:Uri"],
            config["Blobs:SasKey"]);
    }

    public Auth0Config Auth0 { get; private set; }
    public StorageConfig Storage { get; private set; }
    public DatabaseConfig Database { get; private set; }
    public JiraHelpDeskConfig Jira { get; private set; }
    public AzureAiDocumentConfig DocumentAi { get; private set; }
    public AzureAiSearchConfig SearchAi { get; private set; }
}