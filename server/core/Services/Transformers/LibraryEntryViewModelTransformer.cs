
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public class LibraryEntryViewModelTransformer
{
    public static LibraryEntryViewModel ToViewModel(LibrarySearchDocument doc)
    {
        return new LibraryEntryViewModel
        {
            EntryId = doc.EntryId,
            AuthorId = doc.Author.Id,
            AuthorName = doc.Author.Name,
            Title = doc.Title_En,
            Description = doc.Description_En,
            Type = doc.TypeId,
            LastModified = doc.LastModified,
            Status = doc.StatusId,
            OwnerId = doc.OwnerId,
            OwnerName = doc.OwnerName,
            Visibility = doc.Visibility,
            Version = doc.Version
        };
    }
}