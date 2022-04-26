using Wbs.Utilities.Models;
using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Wbs.Utilities.DataServices
{
    public class MetadataDataService
    {
        private readonly DbService db;

        public MetadataDataService(Database database)
        {
            db = new DbService(database.GetContainer(CONTAINERS.METADATA));
        }

        public Task<Metadata<T>> GetAsync<T>(string pk, string id) => db.GetByIdAsync<Metadata<T>>(pk, id);

        public Task UpsertAsync<T>(Metadata<T> document, string pk) => db.UpsertAsync(document, pk);
    }
}