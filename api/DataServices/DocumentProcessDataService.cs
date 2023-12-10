using System.Net;
using Microsoft.Azure.Cosmos;
using Wbs.Api.Configuration;
using Wbs.Api.Models;

namespace Wbs.Api.DataServices;
public class DocumentProcessDataService
{
    private readonly AppConfig config;

    public DocumentProcessDataService(AppConfig config)
    {
        this.config = config;
    }

    public async Task UpsertAsync(DocumentProcessResults document)
    {
        var client = new CosmosClient(config.Database.CosmosConnectionString);
        var container = client.GetContainer(config.DocumentAi.LogDatabase, "Documents");

        var response = await container.CreateItemAsync(document, new PartitionKey(document.owner));

        if (response.StatusCode != HttpStatusCode.Created)
        {
            throw new Exception($"An error occured creating a db object: {response.StatusCode}.");
        }
    }
}