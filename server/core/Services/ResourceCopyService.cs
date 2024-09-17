using Microsoft.Data.SqlClient;
using Wbs.Core.DataServices;

namespace Wbs.Core.Services;

public class ResourceCopyService
{
    private readonly ContentResourceDataService dataService;
    private readonly ContentResourceStorageService storage;

    public ResourceCopyService(
        ContentResourceDataService dataService,
        ContentResourceStorageService storage)
    {
        this.dataService = dataService;
        this.storage = storage;
    }

    public async Task CopyAsync(SqlConnection conn, string fromOwner, string toOwner, Dictionary<string, string> copyInfo)
    {
        var resources = await dataService.GetListAsync(conn, fromOwner, copyInfo.Keys);

        if (resources.Count == 0) return;

        var saves = new List<Task>();

        foreach (var resource in resources)
        {
            var fromId = resource.Id;
            var toId = IdService.Create();

            resource.Id = toId;
            resource.ParentId = copyInfo[resource.ParentId];

            saves.Add(dataService.SetAsync(conn, resource));
            saves.Add(storage.CopyResourceAsync(fromOwner, fromId, toOwner, toId));

            if (saves.Count == 10)
            {
                await Task.WhenAll(saves);
                saves.Clear();
            }
        }

        if (saves.Count > 0) await Task.WhenAll(saves);
    }
}
