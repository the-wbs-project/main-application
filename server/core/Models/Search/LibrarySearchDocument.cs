using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace Wbs.Core.Models.Search;

public partial class LibrarySearchDocument
{
    [SimpleField(IsFilterable = true, IsKey = true)]
    public string EntryId { get; set; }

    [SimpleField(IsFilterable = true)]
    public string OwnerId { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string OwnerName { get; set; }

    [SearchableField(IsSortable = true, IsFilterable = true, IsFacetable = true)]
    public string RecordId { get; set; }

    [SimpleField]
    public string VersionAlias { get; set; }

    [SimpleField]
    public int Version { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string Title { get; set; }


    [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public string TypeId { get; set; }

    [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public string TypeName { get; set; }

    [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public DateTimeOffset LastModified { get; set; }

    [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public string StatusId { get; set; }

    [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public string Visibility { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string[] Disciplines_En { get; set; }

    [SimpleField(IsFilterable = true, IsFacetable = true)]
    public string AuthorId { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string AuthorName { get; set; }
}
