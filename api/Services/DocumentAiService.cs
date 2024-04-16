using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Wbs.Api.Configuration;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class DocumentAiService
{
    private readonly AzureAiDocumentConfig config;
    private readonly DocumentProcessDataService db;

    public DocumentAiService(AppConfig config, DocumentProcessDataService db)
    {
        this.config = config.DocumentAi;
        this.db = db;
    }

    public async Task<UploadResults> GetResultsAsync(string owner, string uri)
    {
        var document = await GetAiResultsAsync(uri);
        var allPargraphs = document.Paragraphs.Select(p => p.Content).ToList();
        var paragraphs = CleanList(allPargraphs);
        var toProcess = GetNodes(paragraphs, null);
        var now = DateTime.UtcNow;
        var nodes = new List<ProjectImportResults>();

        foreach (var node in toProcess)
        {
            var obj = new ProjectImportResults();
            var spaceIndex = node.IndexOf(' ');
            var level = node.Substring(0, spaceIndex).TrimEnd('.');

            obj.levelText = node;
            obj.title = node;

            nodes.Add(new ProjectImportResults
            {
                levelText = level,
                title = node.Substring(spaceIndex + 1)
            });
        }

        var results = new UploadResults
        {
            results = nodes,
            unusedParagraphs = paragraphs.Where(p => !toProcess.Contains(p)).ToList(),
            errors = new List<string>
            {
                System.Text.Json.JsonSerializer.Serialize(allPargraphs)
            },
        };

        await db.UpsertAsync(new DocumentProcessResults
        {
            id = now.ToString(),
            owner = owner,
            timestamp = now,
            url = uri,
            results = results,
            paragraphs = document.Paragraphs.Select(p => p.Content).ToList()
        });

        return results;
    }

    private async Task<AnalyzeResult> GetAiResultsAsync(string uri)
    {
        var client = new DocumentAnalysisClient(
            new Uri(config.Endpoint),
            new AzureKeyCredential(config.Key));

        var fileUri = new Uri(uri);
        var operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-read", fileUri);

        return operation.Value;
    }

    private List<string> GetNodes(List<string> paragraphs, string parentLevel)
    {
        var results = new List<string>();
        var counter = 1;

        while (true)
        {
            var level = parentLevel == null ? counter.ToString() : $"{parentLevel}.{counter}";
            var startWith1 = level + " ";
            var startWith2 = level + ". ";
            var nodeIndex = paragraphs.FindIndex(p => p.StartsWith(startWith1) || p.StartsWith(startWith2));

            if (nodeIndex == -1) break;

            results.Add(paragraphs[nodeIndex]);
            results.AddRange(GetNodes(paragraphs, level));

            counter++;
        }

        return results;
    }

    private List<string> CleanList(List<string> paragraphs)
    {
        var results = new List<string>();

        foreach (var paragraph in paragraphs)
        {
            var text = paragraph.Trim();

            if (string.IsNullOrEmpty(text)) continue;
            if (text.Length == 1 && !char.IsNumber(text[0])) continue;

            results.Add(text);
        }

        return results;
    }
}
