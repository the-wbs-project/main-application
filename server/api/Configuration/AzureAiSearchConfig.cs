using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class AzureAiSearchConfig : IAzureAiSearchConfig
{
    public AzureAiSearchConfig(IConfiguration config)
    {
        Key = config["Azure:AI:Search:Key"];
        Url = config["Azure:AI:Search:Url"];
        LibraryIndex = config["Azure:AI:Search:LibraryIndex"];
        ProjectIndex = config["Azure:AI:Search:ProjectIndex"];
    }

    public string Url { get; private set; }
    public string Key { get; private set; }
    public string LibraryIndex { get; private set; }
    public string ProjectIndex { get; private set; }
}