namespace Wbs.Core.Models.Search;

public class LibraryFilters
{
    public string userId { get; set; }
    public string searchText { get; set; }
    public string library { get; set; }
    public string[] typeFilters { get; set; }

    public string ToFilterString(string owner)
    {
        var filterParts = new List<string>();
        //
        //  Ownership filter
        //
        if (library == "organizational") filterParts.Add($"OwnerId eq '{owner}'");
        //if (library == "organizational") filterParts.Add($"(OwnerId eq '{owner}' and StatusId eq 'published')");
        else if (library == "personal") filterParts.Add($"(OwnerId eq '{owner}' and Author/Id eq '{userId}' and (StatusId eq 'published' or StatusId eq 'draft'))");
        else if (library == "watched") filterParts.Add($"(Watchers/any(person: person/Id eq '{userId}') and StatusId eq 'published')");
        else if (library == "public") filterParts.Add($"(Visibility eq 'public' and StatusId eq 'published')");
        //
        //  Type filter
        //
        if (typeFilters != null && typeFilters.Length > 0)
        {
            var typeParts = new List<string>();

            foreach (var type in typeFilters)
            {
                typeParts.Add($"TypeId eq '{type}'");
            }
            filterParts.Add(string.Join(" or ", Wrap(typeParts)));
        }

        return filterParts.Count == 0 ? null : string.Join(" and ", Wrap(filterParts));
    }
    // "filter": "TypeId eq 'project' and (OwnerId eq 'acme_engineering' or Visibility eq 'public')"

    private string[] Wrap(List<string> parts)
    {
        return parts.Select(x => $"({x})").ToArray();
    }
}
