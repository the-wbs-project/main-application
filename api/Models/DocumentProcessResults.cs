using Azure.AI.FormRecognizer.DocumentAnalysis;
namespace Wbs.Api.Models;

public class DocumentProcessResults
{
    public string id { get; set; }
    public string owner { get; set; }
    public DateTime timestamp { get; set; }
    public string url { get; set; }
    public List<string> paragraphs { get; set; }
    public UploadResults results { get; set; }
}
