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
    public string Visibility { get; set; }

    [SimpleField]
    public string Phone { get; set; }

    [SimpleField]
    public string LinkedIn { get; set; }

    [SimpleField]
    public string Twitter { get; set; }

    [SimpleField]
    public string Picture { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastLogin { get; set; }

    public string LoginCount { get; set; }
    //
    //  Searchable
    //
    [SearchableField(IsFilterable = true)]
    public string Email { get; set; }

    [SearchableField(IsFilterable = true)]
    public string Title { get; set; }

    [SearchableField(IsFilterable = true)]
    public string OrgDisplayName { get; set; }

    [SearchableField]
    public string FullName { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string[] Roles { get; set; }

    public static string CreateId(string orgName, string userId, string visibility)
    {
        return $"{orgName}_{userId.Replace("auth0|", "")}_{visibility}";
    }

}
