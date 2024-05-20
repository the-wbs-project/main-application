namespace Wbs.Core.Configuration;

public interface IAzureAiSearchConfig
{
    string Url { get; }
    string Key { get; }
    string LibraryIndex { get; }
    string ProjectIndex { get; }
}