using Wbs.Utilities.Models;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace Wbs.Utilities.DataServices
{
    public class DbService
    {
        private readonly List<HttpStatusCode> codes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.Created };
        private readonly List<HttpStatusCode> deleteCodes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.NotFound, HttpStatusCode.NoContent };
        private readonly Container container;
        private readonly string pkField;

        public DbService(CosmosClient client, string database, string container, string pkField = "pk")
        {
            this.container = client.GetContainer(database, container);
            this.pkField = pkField;
        }

        public Task<List<T>> GetAllByPartitionAsync<T>(string partitionKey = null) where T : class, IIdObject
        {
            if (string.IsNullOrWhiteSpace(partitionKey)) throw new ArgumentNullException(nameof(partitionKey));

            var query = new QueryDefinition($"SELECT * FROM c WHERE c.{pkField} = @pk");
            query.WithParameter("@pk", partitionKey);

            return GetListAsync<T>(query);
        }

        public async Task<T> GetByIdAsync<T>(string partitionKey, string id) where T : class, IIdObject
        {
            if (string.IsNullOrWhiteSpace(partitionKey)) throw new ArgumentNullException(nameof(partitionKey));
            if (string.IsNullOrWhiteSpace(id)) throw new ArgumentNullException(nameof(id));

            try
            {
                var resp = await container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));

                return (resp.StatusCode == HttpStatusCode.OK) ? resp.Resource : default(T);
            }
            catch (CosmosException e)
            {
                if (e.StatusCode == HttpStatusCode.NotFound) return default(T);
                throw;
            }
        }

        public async Task<List<T>> GetListAsync<T>(string query) where T : class, IIdObject
        {
            return await GetListAsync<T>(new QueryDefinition(query)); ;
        }

        public async Task<List<T>> GetListAsync<T>(QueryDefinition query) where T : class, IIdObject
        {
            var list = new List<T>();
            var iterator = container.GetItemQueryStreamIterator(query);
            while (iterator.HasMoreResults)
            {
                var results = await iterator.ReadNextAsync();

                if (results?.Content == null) continue;

                var obj = DeserializeFromStream<Results<T>>(results.Content);

                list.AddRange(obj?.Documents);
            }
            return list;
        }

        public async Task<T> GetAsync<T>(QueryDefinition query) where T : class
        {
            var iterator = container.GetItemQueryStreamIterator(query);
            if (!iterator.HasMoreResults) return default(T);

            var results = await iterator.ReadNextAsync();

            var obj = DeserializeFromStream<Results<T>>(results.Content);

            return obj.Documents.Length > 0 ? obj.Documents[0] : default(T);
        }

        public async Task<string> CreateAync<T>(T document, string pk) where T : class, IIdObject
        {
            if (string.IsNullOrWhiteSpace(document.id)) document.id = Guid.NewGuid().ToString();

            var response = await container.CreateItemAsync(document, new PartitionKey(pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured creating a db object: {response.StatusCode}.");

            return response.Resource.id;
        }

        public async Task UpsertAsync<T>(T document, string pk) where T : IIdObject
        {
            var response = await container.UpsertItemAsync(document, new PartitionKey(pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured upserting a db object: {response.StatusCode}.");
        }

        /*public async Task DeleteAsync<T>(QueryDefinition query) where T : IIdObject, new()
        {
            foreach (var item in await GetListAsync<T>(query))
            {
                var response = await container.DeleteItemAsync<object>(item.id, new PartitionKey(item.pk));

                if (!deleteCodes.Contains(response.StatusCode)) throw new Exception($"An error occured deleting a db object: {response.StatusCode}.");
            }
        }*/

        public async Task DeleteAsync(string pk, string id)
        {
            var response = await container.DeleteItemAsync<object>(id, new PartitionKey(pk));

            if (!deleteCodes.Contains(response.StatusCode)) throw new Exception($"An error occured deleting a db object: {response.StatusCode}.");
        }

        public async Task UpdateAync<T>(T document, string pk) where T : IIdObject
        {
            var response = await container.UpsertItemAsync(document, new PartitionKey(pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured updating a db object: {response.StatusCode}.");
        }

        public static T DeserializeFromStream<T>(Stream stream)
        {
            var serializer = new JsonSerializer();

            using (var sr = new StreamReader(stream))
            using (var jsonTextReader = new JsonTextReader(sr))
            {
                return serializer.Deserialize<T>(jsonTextReader);
            }
        }

        public class Results<A>
        {
            public A[] Documents { get; set; }
        }
    }
}
