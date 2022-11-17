using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Wbs.Utilities.DataServices;
using Wbs.Utilities.Models;

namespace Wbs.Utilities.Services.Importers
{
    public class ExcelFileImporter : BaseExtractService
    {
        private readonly MetadataDataService metadata;

        public ExcelFileImporter(MetadataDataService metadata)
        {
            this.metadata = metadata;
        }

        public async Task<UploadResults> RunAsync(Stream stream, string culture)
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