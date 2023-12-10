namespace Wbs.Api.Configuration;

public class AzureDocumentAiConfig
{
    public string Endpoint { get; set; }
    public string Key { get; set; }
    public string LogDatabase { get; set; }

    //Azure:AI:Document
    public AzureDocumentAiConfig(string endpoint, string key, string logDatabase)
    {
        Key = key;
        Endpoint = endpoint;
        LogDatabase = logDatabase;
    }
}