namespace Wbs.Api.Configuration;

public class AzureAiSearchConfig
{
    public string Url { get; set; }
    public string Key { get; set; }
    public string LibraryIndex { get; set; }
    public string ProjectIndex { get; set; }

    public AzureAiSearchConfig(string url, string key, string libraryIndex, string projectIndex)
    {
        Key = key;
        Url = url;
        LibraryIndex = libraryIndex;
        ProjectIndex = projectIndex;
    }
}