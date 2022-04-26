using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wbs.Utilities.DataServices;
using Wbs.Utilities.Models;
using Wbs.Utilities.Services;

namespace Wbs.Utilities
{
    public class CategoryExtracts
    {
        private readonly MetadataDataService metadataDataService;
        private readonly Storage storage;
        
        public CategoryExtracts(MetadataDataService metadataDataService, Storage storage)
        {
            this.metadataDataService = metadataDataService;
            this.storage = storage;
        }

        [FunctionName("CategoryExtracts-Output")]
        public async Task RunOutput([QueueTrigger("cats-output")] string nothing, ILogger log)
        {
            var resourcesObj = await metadataDataService.GetAsync<Dictionary<string, Dictionary<string, string>>>("Resources", "en-US.General");
            var resourcesObj2 = await metadataDataService.GetAsync<Dictionary<string, Dictionary<string, string>>>("Resources", "en-US.Wbs");
            var phaseList = await metadataDataService.GetAsync<List<ListItem>>("Lists", "categories_phase");
            var disciplineList = await metadataDataService.GetAsync<List<ListItem>>("Lists", "categories_discipline");
            var delete_reasonList = await metadataDataService.GetAsync<List<ListItem>>("Lists", "delete_reasons");
            var resources = new Resources();
            var phases = new Dictionary<string, ListItem>();
            var disciplines = new Dictionary<string, ListItem>();
            var delete_reasons = new Dictionary<string, ListItem>();

            resources.Add(resourcesObj.values);
            resources.Add(resourcesObj2.values);

            foreach (var x in phaseList.values)
                phases.Add(resources.Get(x.label), x);
            
            foreach (var x in disciplineList.values)
                disciplines.Add(resources.Get(x.label), x);

            foreach (var x in delete_reasonList.values)
                delete_reasons.Add(resources.Get(x.label), x);


            var package = new ExcelPackage();

            AddSheet(package, "Phase List", phases);
            AddSheet(package, "Discipline List", disciplines);
            AddSheet(package, "Delete Not List", delete_reasons);

            await storage.SaveFileAsync("downloads", null, "categories.xlsx", package.GetAsByteArray(), false);
        }

        private void AddSheet(ExcelPackage package, string name, Dictionary<string, ListItem> items)
        {
            var sheet = package.Workbook.Worksheets.Add(name);

            sheet.SetValue(1, 1, "Id");
            sheet.SetValue(1, 2, "Name");
            sheet.SetValue(1, 3, "Tags");
            var row = 2;

            foreach (var label in items.Keys.OrderBy(x => x))
            {
                var obj = items[label];

                sheet.SetValue(row, 1, obj.id);
                sheet.SetValue(row, 2, label);
                sheet.SetValue(row, 3, string.Join(", ", obj.tags ?? new List<string>()));
                row++;
            }
        }
    }
}
