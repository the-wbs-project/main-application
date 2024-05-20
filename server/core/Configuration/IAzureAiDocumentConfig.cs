namespace Wbs.Core.Configuration;

public interface IAzureAiDocumentConfig
{
    string Endpoint { get; }
    string Key { get; }
    string LogDatabase { get; }
}