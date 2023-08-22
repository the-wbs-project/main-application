﻿using OfficeOpenXml;
using Wbs.Api.Configuration;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Services.Exporters;

public class ExcelFileExporter : BaseExtractService
{
    private readonly Storage storage;

    public ExcelFileExporter(AppConfig config, ListDataService listDataService, ResourcesDataService resourceDataService, Storage storage) : base(config, listDataService, resourceDataService)
    {
        this.storage = storage;
    }

    public async Task<byte[]> RunAsync(IEnumerable<WbsPhaseView> nodes, string culture)
    {
        var wbFile = await storage.GetFileAsBytesAsync("templates", "phase-extract.xlsx");
        var disciplines = await GetDisciplinesAsync(culture);

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
                wbsSheet.SetValue(row, 1, node.levelText);
                wbsSheet.SetValue(row, node.levelText.Split('.').Length + 1, node.title);
                wbsSheet.SetValue(row, 17, (node.syncWithDisciplines ?? false) ? "Yes" : "No");
                wbsSheet.SetValue(row, 18, node.description);

                var col = 12;

                if (node.disciplines != null)
                {
                    foreach (var id in node.disciplines.Take(5))
                    {
                        if (id == null) continue;

                        wbsSheet.SetValue(row, col, disciplines[id]);
                        col++;
                    }
                }
                row++;
            }

            return package.GetAsByteArray();
        }
    }
}
