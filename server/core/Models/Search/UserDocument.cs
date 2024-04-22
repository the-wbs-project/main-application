using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class UserDocument
{
    public UserDocument()
    {
    }
    public UserDocument(string id, string name)
    {
        Id = id;
        Name = name;
    }

    [SimpleField(IsFilterable = true)]
    public string Id { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string Name { get; set; }
}
