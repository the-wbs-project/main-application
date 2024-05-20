namespace Wbs.Core.Models;

public class ExportData
{
    public List<Category> customDisciplines { get; set; }
    public List<ExportDataTask> tasks { get; set; }
}

public class ExportDataTask
{
    public string level { get; set; }
    public string title { get; set; }
    public string[] disciplines { get; set; }
}