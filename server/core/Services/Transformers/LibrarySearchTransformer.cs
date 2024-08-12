
using Auth0.ManagementApi.Models;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;

namespace Wbs.Core.Services.Transformers;

public static class LibrarySearchTransformer
{
    public static LibrarySearchDocument CreateDocument(
        LibraryEntry entry,
        LibraryEntryVersion version,
        Organization owner,
        string typeName,
        string authorName,
        IEnumerable<string> disciplines)
    {
        var doc = new LibrarySearchDocument
        {
            EntryId = entry.Id,
            Version = version.Version,
            OwnerId = entry.OwnerId,
            OwnerName = owner.DisplayName,
            Title = version.Title,
            TypeId = entry.Type,
            TypeName = typeName,
            LastModified = version.LastModified,
            StatusId = version.Status,
            Disciplines_En = disciplines.ToArray(),
            AuthorId = version.Author,
            AuthorName = authorName,
            VersionAlias = version.VersionAlias,
            Visibility = entry.Visibility
        };

        return doc;
    }
}