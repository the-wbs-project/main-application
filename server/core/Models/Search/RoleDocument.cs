using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class RoleDocument
{
    public RoleDocument() { }

    public RoleDocument(string id, string name)
    {
        Id = id;
        Name = name;
    }

    [SimpleField(IsFilterable = true)]
    public string Id { get; set; }

    [SearchableField(IsFilterable = true, IsFacetable = true)]
    public string Name { get; set; }
}
