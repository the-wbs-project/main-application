using Wbs.Utilities.Models;
using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Wbs.Utilities.DataServices
{
    public class DbService2<T> : DbService where T : class, IIdObject
    {
        public DbService2(CosmosClient client, string database, string container, string globalPartitionKey = null) 
            : base(client, database, container, globalPartitionKey)
        {
        }

        public Task<List<T>> GetAllByPartitionAsync(string partitionKey = null)
        {
            return base.GetAllByPartitionAsync<T>(partitionKey);
        }

        public Task<T> GetByIdAsync(string id) => base.GetByIdAsync<T>(id);

        public Task<T> GetByIdAsync(string partitionKey, string id) => GetByIdAsync<T>(partitionKey, id);

        public Task<List<T>> GetListAsync(string query) => GetListAsync<T>(new QueryDefinition(query));

        public Task<List<T>> GetListAsync(QueryDefinition query) => GetListAsync<T>(query);

        public Task<T> GetAsync(QueryDefinition query) => GetAsync<T>(query);

        public Task<string> CreateAync(T document, string pk) => base.CreateAync<T>(document, pk);

        public Task UpsertAsync(T document, string pk) => UpsertAsync<T>(document, pk);

        public Task UpdateAync(T document, string pk) => UpsertAsync<T>(document, pk);
    }
}
