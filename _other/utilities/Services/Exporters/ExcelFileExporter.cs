using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Wbs.Utilities.DataServices;
using Wbs.Utilities.Models;

namespace Wbs.Utilities.Services.Exporters
{
    public class ExcelFileExporter : BaseExtractService
    {
        private readonly MetadataDataService metadata;
        private readonly Storage storage;

        public ExcelFileExporter(MetadataDataService metadata, Storage storage)
        {
            this.metadata = metadata;
            this.storage = storage;
        }

        public async Task<byte[]> RunAsync(List<WbsPhaseView> nodes, string culture)
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
        
        private async Task<Dictionary<string, string>> GetDisciplinesAsync(string culture)
        {
            var resourcesObj = await metadata.GetResourceAsync(culture, "General");
            var disciplineList = await metadata.GetListAsync("categories_discipline");
            var resources = new Resources();

            resources.Add(resourcesObj.values);

            var disciplines = new Dictionary<string, string>();

            foreach (var cat in disciplineList) disciplines.Add(cat.id, resources.Get(cat.label));

            return disciplines;
        }
    }
}