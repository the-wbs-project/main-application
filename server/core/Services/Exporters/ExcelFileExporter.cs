using OfficeOpenXml;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Exporters;

public class ExcelFileExporter : BaseExtractService
{
    private readonly Storage storage;

    public ExcelFileExporter(IDatabaseConfig config, ListDataService listDataService, ResourcesDataService resourceDataService, Storage storage) : base(config, listDataService, resourceDataService)
    {
        this.storage = storage;
    }

    public async Task<byte[]> RunAsync(IEnumerable<ExportDataTask> nodes, List<Category> customDisciplines, string culture)
    {
        var wbFile = await storage.GetFileAsBytesAsync("templates", "phase-extract.xlsx");
        var disciplines = await GetDisciplinesAsync(culture);

        foreach (var custom in customDisciplines)
        {
            disciplines.Add(custom.id, custom.label);
        }

        using (var package = new ExcelPackage())
        {
            using (var stream = new MemoryStream(wbFile))
                package.Load(stream);
            //
            //  Add cats
            //
            var catSheet = package.Workbook.Worksheets["Categories"];
            var row = 2;

            foreach (var label in disciplines.Values.OrderBy(x => x))
            {
                catSheet.SetValue(row, 1, label);
                row++;
            }
            //
            //  Add nodes
            //
            var wbsSheet = package.Workbook.Worksheets["WBS"];
            row = 2;

            foreach (var node in nodes)
            {
                wbsSheet.SetValue(row, 1, node.level);
                wbsSheet.SetValue(row, node.level.Split('.').Length + 1, node.title);

                var col = 12;

                if (node.disciplines != null)
                    foreach (var discipline in node.disciplines.Where(x => x != null))
                    {
                        wbsSheet.SetValue(row, col, discipline);
                        col++;
                    }
                row++;
            }

            return package.GetAsByteArray();
        }
    }
}
