using Azure.AI.FormRecognizer.DocumentAnalysis;
namespace Wbs.Api.Models;

public class DocumentProcessResults
{
    public string id { get; set; }
    public string owner { get; set; }
    public DateTime timestamp { get; set; }
    public string url { get; set; }
    public AnalyzeResult aiResults { get; set; }
    public List<DocumentNode> processResults { get; set; }
    public List<string> unusedTexts { get; set; }
}
