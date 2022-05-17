using Wbs.Utilities.Models;
using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Wbs.Utilities.Configuration;

namespace Wbs.Utilities.DataServices
{
    public class MetadataDataService
    {
        private readonly DbService2<ListItem> listDb;
        private readonly DbService2<ResourceObject> resourceDb;

        public MetadataDataService(CosmosClient client, AppConfig config)
        {
            listDb = new DbService2<ListItem>(client, config.cosmos.metadataDb, "");
            resourceDb = new DbService2<ResourceObject>(client, config.cosmos.metadataDb, "");
        }

        public Task<ResourceObject> GetResourceAsync(string culture, string id) => resourceDb.GetByIdAsync(culture, id);

        public Task<List<ListItem>> GetListAsync(string type) => listDb.GetAllByPartitionAsync(type);

        //public Task UpsertAsync<T>(ResourceObject<T> document, string id) => db.UpsertAsync(document, id);
    }
}