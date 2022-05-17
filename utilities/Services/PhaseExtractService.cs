using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Wbs.Utilities.DataServices;
using Wbs.Utilities.Models;

namespace Wbs.Utilities.Services
{
    public class PhaseExtractService : BaseExtractService
    {
        private readonly MetadataDataService metadata;
        private readonly Storage storage;

        public PhaseExtractService(MetadataDataService metadata, Storage storage)
        {
            this.metadata = metadata;
            this.storage = storage;
        }

        public async Task<byte[]> DownloadAsync(List<WbsPhaseView> nodes, string culture)
        {
            var wbFile = await storage.GetFileAsBytesAsync("templates", "phase-extract.xlsx");
            var disciplines = await GetDisciplinesAsync(culture);

            using (var package = new OfficeOpenXml.ExcelPackage())
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

        public async Task<UploadResults> UploadAsync(Stream stream, string culture)
        {
            var disciplines = await GetDisciplinesAsync(culture);

            using (var package = new ExcelPackage())
            {
                package.Load(stream);
                //
                //  Add nodes
                //
                var sheet = package.Workbook.Worksheets["WBS"];
                var results = new UploadResults
                {
                    errors = TestSheet(sheet),
                    results = new List<WbsNodeView>()
                };

                if (results.errors.Count > 0) return results;
                var row = 2;

                while (sheet.GetValue(row, 1) != null)
                {
                    var obj = new WbsPhaseView();
                    var sync = sheet.GetValue<string>(row, 17)?.ToLower();

                    obj.levelText = sheet.GetValue<string>(row, 1)?.Trim();
                    obj.description = sheet.GetValue<string>(row, 18)?.Trim();
                    obj.syncWithDisciplines = sync == "y" || sync == "yes";

                    for (var i = 1; i <= 10; i++)
                    {
                        var text = sheet.GetValue<string>(row, i + 1)?.Trim();

                        if (!string.IsNullOrEmpty(text))
                        {
                            obj.title = text;
                            break;
                        }
                    }
                    for (var i = 1; i <= 5; i++)
                    {
                        var text = sheet.GetValue<string>(row, i + 11)?.Trim()?.ToLower();

                        if (string.IsNullOrEmpty(text)) break;

                        var discipline = disciplines.FirstOrDefault(x => x.Value.ToLower() == text).Key;

                        if (discipline != null)
                        {
                            if (obj.disciplines == null)
                                obj.disciplines = new List<string> { discipline };
                            else
                                obj.disciplines.Add(discipline);
                        }
                    }
                    results.results.Add(obj);
                    row++;
                }

                return results;
            }
        }
        
        private List<string> TestSheet(ExcelWorksheet sheet)
        {
            var errors = new List<string>();
            var row = 2;
            string prev = null;

            while (sheet.GetValue(row, 1) != null)
            {
                var levelText = sheet.GetValue<string>(row, 1)?.Trim();
                var foundTitle = false;

                for (var i = 1; i <= 10; i++)
                {
                    var text = sheet.GetValue<string>(row, i + 1)?.Trim();

                    if (!string.IsNullOrEmpty(text))
                    {
                        foundTitle = true;
                        break;
                    }
                }
                if (!TestFormat(levelText))
                {
                    errors.Add($"Row {row}: The level was not in a proper format of digits and periods.");
                }
                else if (prev != null && !TestLevels(prev, levelText))
                {
                    errors.Add($"Row {row}: The level was not in a proper sequence.");
                }
                if (!foundTitle)
                {
                    errors.Add($"Row {row}: The title for the task was not included.");
                }
                prev = levelText;
                row++;
            }

            return errors;
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