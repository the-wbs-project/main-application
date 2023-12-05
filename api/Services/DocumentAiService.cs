using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Wbs.Api.Configuration;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class DocumentAiService
{
    private readonly AzureDocumentAiConfig config;
    private readonly DocumentProcessDataService db;

    public DocumentAiService(AppConfig config, DocumentProcessDataService db)
    {
        this.config = config.DocumentAi;
        this.db = db;
    }

    public async Task<DocumentProcessResults> GetResultsAsync(string owner, string uri)
    {
        var document = await GetAiResultsAsync(uri);
        var paragraphs = document.Paragraphs.Select(p => p.Content).ToList();
        var nodes = GetNodes(paragraphs, null);
        var now = DateTime.UtcNow;
        var results = new DocumentProcessResults
        {
            id = now.ToString(),
            owner = owner,
            timestamp = now,
            url = uri,
            aiResults = document,
            processResults = nodes,
            unusedTexts = paragraphs
        };

        await db.UpsertAsync(results);

        return results;
    }

    private async Task<AnalyzeResult> GetAiResultsAsync(string uri)
    {
        var client = new DocumentAnalysisClient(
            new Uri(config.Endpoint),
            new AzureKeyCredential(config.Key));

        var fileUri = new Uri(uri);
        var operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-document", fileUri);

        return operation.Value;
    }

    private List<DocumentNode> GetNodes(List<string> paragraphs, string parentLevel)
    {
        var results = new List<DocumentNode>();
        var counter = 1;

        while (true)
        {
            var level = parentLevel == null ? counter.ToString() : $"{parentLevel}.{counter}";
            var startWith = level + " ";
            var nodeIndex = paragraphs.FindIndex(p => p.StartsWith(startWith));

            if (nodeIndex == -1) break;

            var paragraph = paragraphs[nodeIndex];
            var node = new DocumentNode
            {
                order = counter,
                level = level,
                text = paragraph.Replace(startWith, "").Trim(),
                children = new List<DocumentNode>()
            };

            paragraphs.RemoveAt(nodeIndex);

            node.children = GetNodes(paragraphs, level);

            results.Add(node);
            counter++;
        }

        return results;
    }
}
