using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;

namespace Wbs.Core.Services;

public abstract class BaseExtractService
{
    private readonly IDatabaseConfig dbConfig;
    private readonly ListDataService listDataService;
    private readonly ResourcesDataService resourceDataService;

    public BaseExtractService(IDatabaseConfig dbConfig, ListDataService listDataService, ResourcesDataService resourceDataService)
    {
        this.dbConfig = dbConfig;
        this.listDataService = listDataService;
        this.resourceDataService = resourceDataService;
    }

    public bool TestFormat(string x)
    {
        foreach (var c in x)
        {
            if (!char.IsNumber(c) && c != '.') return false;
        }
        return true;
    }

    public bool TestLevels(string a, string b)
    {
        //
        //  Build options
        //
        var parts = a.Split('.').Select(x => int.Parse(x)).ToArray();
        var options = new List<string> { a + ".1" };

        for (var i = 0; i < parts.Length; i++)
        {
            if (i == 0) options.Add((parts[0] + 1).ToString());
            else
            {
                var p = parts.Take(i).ToList();
                p.Add(parts[i] + 1);

                options.Add(string.Join('.', p));
            }
            //options.Add(string.Join('.', parts.Take(i), parts[0] + 1));
        }
        return options.Contains(b);
    }

    protected async Task<Dictionary<string, string>> GetDisciplinesAsync(string culture)
    {
        using (var conn = new SqlConnection(dbConfig.SqlConnectionString))
        {
            await conn.OpenAsync();

            var resourcesObj = await resourceDataService.GetAllAsync(conn, culture);
            var disciplineList = await listDataService.GetAsync(conn, "categories_discipline");
            var resources = new Resources();

            resources.Add(resourcesObj);

            var disciplines = new Dictionary<string, string>();

            foreach (var cat in disciplineList) disciplines.Add(cat.id, resources.Get(cat.label));

            return disciplines;
        }

    }
}
