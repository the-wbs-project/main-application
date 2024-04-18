namespace Wbs.Core.Models;

public class UploadResults
{
    public List<string> errors { get; set; }
    public List<string> unusedParagraphs { get; set; }
    public List<ProjectImportResults> results { get; set; }
}
