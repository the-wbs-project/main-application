using System.Net;
using Microsoft.Azure.Cosmos;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;
public class DocumentProcessDataService
{
    private readonly IDatabaseConfig dbConfig;
    private readonly IAzureAiDocumentConfig docConfig;

    public DocumentProcessDataService(IDatabaseConfig dbConfig, IAzureAiDocumentConfig docConfig)
    {
        this.dbConfig = dbConfig;
        this.docConfig = docConfig;
    }

    public async Task UpsertAsync(DocumentProcessResults document)
    {
        var client = new CosmosClient(dbConfig.CosmosConnectionString);
        var container = client.GetContainer(docConfig.LogDatabase, "Documents");

        var response = await container.CreateItemAsync(document, new PartitionKey(document.owner));

        if (response.StatusCode != HttpStatusCode.Created)
        {
            throw new Exception($"An error occured creating a db object: {response.StatusCode}.");
        }
    }
}