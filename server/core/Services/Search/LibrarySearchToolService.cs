using Wbs.Core.DataServices;

namespace Wbs.Core.Services.Search;

public class LibrarySearchToolService
{
    private readonly DbService db;
    private readonly LibrarySearchIndexService searchIndexService;
    private readonly OrganizationDataService organizationDataService;
    private readonly LibraryEntryViewDataService entryViewDataService;
    private readonly LibrarySearchService searchSearch;

    public LibrarySearchToolService(LibrarySearchIndexService searchIndexService, DbService db, LibrarySearchService searchSearch, LibraryEntryViewDataService entryViewDataService, OrganizationDataService organizationDataService)
    {
        this.searchIndexService = searchIndexService;
        this.db = db;
        this.searchSearch = searchSearch;
        this.entryViewDataService = entryViewDataService;
        this.organizationDataService = organizationDataService;
    }

    public async Task RebuildAsync()
    {
        await searchIndexService.DeleteIndexAsync();
        await searchIndexService.VerifyIndexAsync();
        var orgs = await organizationDataService.GetAllAsync();

        using var conn = await db.CreateConnectionAsync();

        foreach (var org in orgs)
        {
            var entries = await entryViewDataService.GetAllAsync(conn, org.Name);

            await searchIndexService.PushToSearchAsync(conn, org.Name, entries.Select(e => e.EntryId).ToArray());
        }
    }

    public async Task RebuildAsync(string organization)
    {
        using var conn = await db.CreateConnectionAsync();

        var entries = await entryViewDataService.GetAllAsync(conn, organization);

        await searchIndexService.VerifyIndexAsync();
        await searchIndexService.PushToSearchAsync(conn, organization, entries.Select(e => e.EntryId).ToArray());
    }
}
