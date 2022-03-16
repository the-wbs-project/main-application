using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace table_copy
{
    class Program {
        private static readonly List<HttpStatusCode> codes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.Created };

        static async Task Main(string[] args) {
            var configFileName = args.Length == 0 ? "config.json" : $"config-{args[0]}.json"; ;
            var configFile = await File.ReadAllTextAsync(Path.Combine("../files", configFileName));
            var config = JsonConvert.DeserializeObject<Dictionary<string, string>>(configFile);
            var container = CreateContainer(config);
            var keys = await GetKeysAsync(container);

            Console.WriteLine("Select a key:");
          
            for (var i = 0; i < keys.Count; i++)
                Console.WriteLine($"{i}. {keys[i]}");
            
            var indexi = Console.ReadLine().Split(',').Select(x => int.Parse(x)).ToList();
            
            foreach (var index in indexi)
                await cleanPartitionAsync(container, keys[index]);
        }

        public static async Task<List<string>> GetKeysAsync(Container srcContainer)
        {
            var query = new QueryDefinition("SELECT DISTINCT VALUE c.pk FROM c");

            return (await GetListAsync<string>(srcContainer, query)).OrderBy(x => x).ToList();
        }

        private static async Task cleanPartitionAsync(Container container, string partitionKey)
        {
            var query = new QueryDefinition("SELECT VALUE c.id FROM c WHERE c.pk = @pk");
            query.WithParameter("@pk", partitionKey);

            Console.Write(partitionKey + ": ");
            var all = await GetListAsync<string>(container, query);
            var count = 0;

            Console.Write(all.Count + " -> ");

            foreach (var id in all)
            {
                await DeleteAsync(container, id, partitionKey);
                count++;

                if (count % 10 == 0) Console.Write(".");
            }
            Console.WriteLine();
        }
        
        public static async Task<List<U>> GetListAsync<U>(Container container, QueryDefinition query)
        {
            var list = new List<U>();
            var iterator = container.GetItemQueryStreamIterator(query);
            while (iterator.HasMoreResults)
            {
                var results = await iterator.ReadNextAsync();

                if (results?.Content == null) continue;

                var obj = await Utf8Json.JsonSerializer.DeserializeAsync<Results<U>>(results.Content);

                list.AddRange(obj.Documents);
            }
            return list;
        }

        public static async Task UpsertAsync(Container container, dynamic document, string pk)
        {
            var response = await container.UpsertItemAsync(document, new PartitionKey(pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured upserting a db object: {response.StatusCode}.");
        }

        private static Container CreateContainer(Dictionary<string, string> config) {
            var client = new CosmosClient(config["cs"]);
            return client.GetContainer(config["db"], config["coll"]);
        }

        public static async Task DeleteAsync(Container container, string id, string pk)
        {
            var response = await container.DeleteItemAsync<Results<object>>(id, new PartitionKey(pk));

            if (response.StatusCode != HttpStatusCode.NoContent) throw new Exception($"An error occured deleting a db object: {response.StatusCode}.");
        }
    } 

    public class Results<A>
    {
      public A[] Documents { get; set; }
    }
}
