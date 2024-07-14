
using Auth0.ManagementApi.Models;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public static class LibrarySearchTransformer
{
    public static LibrarySearchDocument CreateDocument(
        string visibility,
        LibraryEntryViewModel entry,
        Organization owner,
        string typeName,
        IEnumerable<string> watcherIds,
        IEnumerable<LibraryEntryNode> entryTasks,
        IEnumerable<string> disciplines,
        Dictionary<string, UserDocument> users)
    {
        var doc = new LibrarySearchDocument
        {
            Id = $"{entry.EntryId}-{visibility}",
            EntryId = entry.EntryId,
            Version = entry.Version,
            OwnerId = entry.OwnerId,
            OwnerName = owner.DisplayName,
            Title_En = entry.Title,
            Description_En = entry.Description,
            TypeId = entry.Type,
            TypeName = typeName,
            LastModified = entry.LastModified,
            StatusId = entry.Status,
            Visibility = visibility,
            Disciplines_En = disciplines.ToArray(),
            //
            //  Users
            //
            Author = users.ContainsKey(entry.AuthorId) ? new SortableUserDocument(users[entry.AuthorId]) : null,
            Watchers = watcherIds
                .Where(x => users.ContainsKey(x))
                .Select(x => users[x])
                .ToArray(),
            Tasks = GetChildren(entryTasks, null, visibility).ToArray()
        };

        return doc;
    }

    private static List<TaskSearchDocument> GetChildren(IEnumerable<LibraryEntryNode> entryTasks, string parentId, string visibility)
    {
        var results = new List<TaskSearchDocument>();

        foreach (var task in entryTasks.Where(x => x.parentId == parentId))
        {
            if (task.visibility == "private" && visibility == "public") continue;

            var children = GetChildren(entryTasks, task.id, visibility);

            results.Add(new TaskSearchDocument
            {
                TaskId = task.id,
                Title_En = task.title,
                Description_En = task.description,
            });

            results.AddRange(children);
        }
        //

        return results;
    }
}