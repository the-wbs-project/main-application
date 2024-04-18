namespace Wbs.Core.Models.Search;

public class LibraryFilters
{
    public string searchText { get; set; }
    public string ownership { get; set; }
    public string[] typeFilters { get; set; }

    public string ToFilterString(string owner)
    {
        var filterParts = new List<string>();
        //
        //  Ownership filter
        //
        if (ownership == "owner")
        {
            filterParts.Add($"OwnerId eq '{owner}'");
        }
        else if (ownership == "public")
        {
            filterParts.Add($"Visibility eq 'public'");
        }
        else
        {
            filterParts.Add($"(OwnerId eq '{owner}') or (Visibility eq 'public')");
        }
        //
        //  Type filter
        //
        if (typeFilters != null && typeFilters.Length > 0)
        {
            var typeParts = new List<string>();

            foreach (var type in typeFilters)
            {
                filterParts.Add($"TypeId eq '{type}'");
            }
            filterParts.Add(string.Join(" or ", Wrap(typeParts)));
        }

        return filterParts.Count > 0 ? string.Join(" and ", Wrap(filterParts)) : null;
    }
    // "filter": "TypeId eq 'project' and (OwnerId eq 'acme_engineering' or Visibility eq 'public')"

    private string[] Wrap(List<string> parts)
    {
        return parts.Select(x => $"({x})").ToArray();
    }
}
