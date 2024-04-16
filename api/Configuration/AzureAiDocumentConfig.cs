namespace Wbs.Api.Configuration;

public class AzureAiDocumentConfig
{
    public string Endpoint { get; set; }
    public string Key { get; set; }
    public string LogDatabase { get; set; }

    //Azure:AI:Document
    public AzureAiDocumentConfig(string endpoint, string key, string logDatabase)
    {
        Key = key;
        Endpoint = endpoint;
        LogDatabase = logDatabase;
    }
}