using Wbs.Core.DataServices;

namespace Wbs.Core.Services.Search;

public class LibrarySearchToolService
{
    private readonly DataServiceFactory data;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly LibrarySearchService searchSearch;

    public LibrarySearchToolService(LibrarySearchIndexService searchIndexService, LibrarySearchService searchSearch, DataServiceFactory data)
    {
        this.data = data;
        this.searchSearch = searchSearch;
        this.searchIndexService = searchIndexService;
    }

    public async Task RebuildAsync()
    {
        await searchIndexService.DeleteIndexAsync();
        await searchIndexService.VerifyIndexAsync();

        using var conn = await data.CreateConnectionAsync();

        foreach (var org in await data.Organizations.GetAllAsync(conn))
        {
            var entries = await data.LibraryViews.GetAllAsync(conn, org.Name);

            await searchIndexService.PushToSearchAsync(conn, org.Name, entries.Select(e => e.EntryId).ToArray());
        }
    }

    public async Task RebuildAsync(string organization)
    {
        using var conn = await data.CreateConnectionAsync();

        var entries = await data.LibraryViews.GetAllAsync(conn, organization);

        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, organization, entries.Select(e => e.EntryId).ToArray());
    }
}
