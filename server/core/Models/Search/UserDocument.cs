using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class UserBasicDocument
{
    public UserBasicDocument() { }

    public UserBasicDocument(string id, string name)
    {
        Id = id;
        Name = name;
    }

    [SimpleField(IsFilterable = true)]
    public string Id { get; set; }

    [SearchableField(IsFilterable = true, IsFacetable = true)]
    public string Name { get; set; }
}

public partial class SortableBasicUserDocument
{
    public SortableBasicUserDocument()
    {
    }
    public SortableBasicUserDocument(string id, string name)
    {
        Id = id;
        Name = name;
    }
    public SortableBasicUserDocument(UserBasicDocument user)
    {
        Id = user.Id;
        Name = user.Name;
    }

    [SimpleField(IsFilterable = true)]
    public string Id { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string Name { get; set; }
}

public partial class UserDocument
{
    [SimpleField(IsFilterable = true)]
    public string Id { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string Name { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string Email { get; set; }

    public int LoginCount { get; set; }

    public int LastLogin { get; set; }

    public OrgUserDocument[] Organizations { get; set; }
}

public partial class OrgUserDocument
{
    [SimpleField(IsFilterable = true)]
    public string OrganizationId { get; set; }

    public RoleDocument[] Roles { get; set; }
}
