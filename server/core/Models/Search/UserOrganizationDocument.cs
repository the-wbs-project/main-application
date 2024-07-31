using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class UserOrganizationDocument
{
    [SimpleField(IsFilterable = false, IsKey = true)]
    public string Id { get; set; }

    [SimpleField(IsFilterable = true)]
    public string UserId { get; set; }

    [SimpleField(IsFilterable = true)]
    public string OrgId { get; set; }

    [SimpleField(IsFilterable = true)]
    public string OrgName { get; set; }

    [SimpleField(IsFilterable = true)]
    public string OrgDisplayName { get; set; }

    [SimpleField(IsFilterable = false)]
    public string Visibility { get; set; }

    [SearchableField(IsFilterable = true)]
    public string FullName { get; set; }

    [SearchableField(IsFilterable = true)]
    public string Email { get; set; }

    [SearchableField(IsFilterable = true, IsFacetable = true)]
    public string Title { get; set; }

    [SearchableField(IsFilterable = false)]
    public string Phone { get; set; }

    [SearchableField(IsFilterable = false)]
    public string LinkedIn { get; set; }

    [SearchableField(IsFilterable = false)]
    public string Twitter { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string[] Roles { get; set; }

    [SearchableField(IsFilterable = false)]
    public string Picture { get; set; }

    [SearchableField(IsFilterable = false)]
    public DateTime? CreatedAt { get; set; }

    [SearchableField(IsFilterable = false)]
    public DateTime? LastLogin { get; set; }

    [SearchableField(IsFilterable = false)]
    public string LoginCount { get; set; }
}
