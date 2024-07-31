using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class UserOrganizationDocument
{
    [SimpleField(IsFilterable = true)]
    public string UserId { get; set; }

    [SearchableField(IsFilterable = true, IsFacetable = true)]
    public string UserName { get; set; }
}

