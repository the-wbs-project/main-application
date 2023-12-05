using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Wbs.Api.Configuration;

namespace Wbs.Api.Services;

public class DocumentAiService
{
    private readonly AzureDocumentAiConfig config;

    public DocumentAiService(AppConfig config)
    {
        this.config = config.DocumentAi;
    }

    public async Task<AnalyzeResult> GetResultsAsync(string uri)
    {
        var client = new DocumentAnalysisClient(
            new Uri(config.Endpoint),
            new AzureKeyCredential(config.Key));

        var fileUri = new Uri(uri);
        var operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-document", fileUri);

        return operation.Value;
    }
}
