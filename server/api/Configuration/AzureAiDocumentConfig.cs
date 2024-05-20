using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class AzureAiDocumentConfig : IAzureAiDocumentConfig
{
    public AzureAiDocumentConfig(IConfiguration config)
    {
        Endpoint = config["Azure:AI:Document:Endpoint"];
        Key = config["Azure:AI:Document:Key"];
        LogDatabase = config["Azure:AI:Document:LogDatabase"];
    }

    public string Endpoint { get; private set; }
    public string Key { get; private set; }
    public string LogDatabase { get; private set; }

}