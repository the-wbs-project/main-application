using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Importers;

public class ExcelFileImporter : BaseExtractService
{
    private readonly ILogger<ExcelFileImporter> logger;

    public ExcelFileImporter(IDatabaseConfig config, ILogger<ExcelFileImporter> logger, ListDataService listDataService, ResourcesDataService resourceDataService) : base(config, listDataService, resourceDataService)
    {
        this.logger = logger;
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
                results = new List<ProjectImportResults>()
            };

            if (results.errors.Count > 0) return results;
            var row = 2;

            while (sheet.GetValue(row, 1) != null)
            {
                var obj = new ProjectImportResults();
                var sync = sheet.GetValue<string>(row, 17)?.ToLower();

                obj.levelText = sheet.GetValue<string>(row, 1)?.Trim();
                obj.title = sheet.GetValue<string>(row, 18)?.Trim();

                for (var i = 1; i <= 10; i++)
                {
                    var text = sheet.GetValue<string>(row, i + 1)?.Trim();

                    if (!string.IsNullOrEmpty(text))
                    {
                        obj.title = text;
                        break;
                    }
                }
                for (var i = 1; i <= 25; i++)
                {
                    var text = sheet.GetValue<string>(row, i + 11)?.Trim()?.ToLower();

                    if (string.IsNullOrEmpty(text)) break;

                    if (obj.resources == null)
                        obj.resources = new List<string> { text };
                    else
                        obj.resources.Add(text);
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
}
