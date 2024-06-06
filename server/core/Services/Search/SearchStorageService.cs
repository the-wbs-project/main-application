
using System.Text;
using System.Text.Json;
using Wbs.Core.DataServices;

namespace Wbs.Core.Services.Search;

public class SearchStorageService
{
    private const string container = "searchdocs";
    private readonly Storage storage;

    public SearchStorageService(Storage storage)
    {
        this.storage = storage;
    }

    public async Task SaveDocumentAsync(string index, string organization, string id, object document)
    {
        var json = JsonSerializer.Serialize(document);
        var bytes = Encoding.UTF8.GetBytes(json);

        await storage.SaveFileAsync(container, [index], $"{organization}|{id}.json", bytes);
    }

    public Task VerifyDoesntExist(string index, string organization, string id)
    {
        return storage.DeleteIfExistsAsync(container, [index], $"{organization}|{id}.json");
    }
}