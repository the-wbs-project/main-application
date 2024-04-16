namespace Wbs.Api.Services;

public class Resources
{
    private readonly List<Dictionary<string, Dictionary<string, string>>> resc;
    private readonly List<Dictionary<string, Dictionary<string, string>>> backup;

    public Resources()
    {
        resc = new List<Dictionary<string, Dictionary<string, string>>>();
        backup = new List<Dictionary<string, Dictionary<string, string>>>();
    }

    public Resources(Dictionary<string, Dictionary<string, string>> resc) : this()
    {
        this.resc.Add(resc);
    }

    public void Add(Dictionary<string, Dictionary<string, string>> resc, Dictionary<string, Dictionary<string, string>> backup = null)
    {
        this.resc.Add(resc);

        if (backup != null)
            this.backup.Add(backup);
    }

    public string Get(string resources)
    {
        var parts = resources.Split('.');

        return Get(parts[0], parts[1]);
    }

    public string Get(string category, string name, bool noBackup = false) => Get(resc, category, name) ?? (noBackup ? null : Get(backup, category, name)) ?? $"{category}.{name}";

    /*public Dictionary<string, string> GetSection(string category)
    {
        if (resc == null || !resc.ContainsKey(category)) return null;

        return resc[category];
    }*/

    private static string Get(List<Dictionary<string, Dictionary<string, string>>> rescList, string category, string name)
    {
        foreach (var resc in rescList)
        {
            if (resc == null || !resc.ContainsKey(category)) continue;

            var cat = resc[category];

            if (!cat.ContainsKey(name)) continue;

            return cat[name];
        }
        return null;
    }
}
