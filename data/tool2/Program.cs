using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace table_copy {
    class Program {
        private static readonly List<HttpStatusCode> codes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.Created };

        static async Task Main(string[] args) {
            //Console.WriteLine(args[0]);
            //var fileDir = args[0];
            //var env = args[1];
            var fileDir = "..\\..\\..\\..\\files";
            var env = "qa";

            var srcConfigFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "config.json"));
            var destConfigFile = await File.ReadAllTextAsync(Path.Combine(fileDir, $"config-{env}.json"));

            var srcConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(srcConfigFile);
            var destConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(destConfigFile);

            var source = new CosmosClient(srcConfig["cs"]);
            var destination = new CosmosClient(destConfig["cs"]);
            //
            //  First lets clear out the existing databases
            //
            Console.WriteLine("Clearing out databases");

            foreach (var db in await GetDatabaseNamesAsync(destination))
            {
                Console.WriteLine("Deleting " + db);
                await destination.GetDatabase(db).DeleteAsync();
            }
            //
            //  Create and populate DBs and Containers
            //
            Console.WriteLine();
            Console.WriteLine("Start creation...");
            Console.WriteLine();

            foreach (var db in await GetDatabaseNamesAsync(source))
            {
                Console.WriteLine();
                Console.WriteLine("Creating " + db);

                await destination.CreateDatabaseIfNotExistsAsync(db);

                var destDb = destination.GetDatabase(db);

                foreach (var container in await GetContainerNamesAsync(source.GetDatabase(db)))
                {
                    var sourceContainer = source.GetContainer(db, container.Id);

                    var destContainer = (await destDb.CreateContainerAsync(new ContainerProperties
                    {
                        Id = container.Id,
                        PartitionKeyPath = container.PartitionKeyPath,
                        IndexingPolicy = container.IndexingPolicy,
                        UniqueKeyPolicy = container.UniqueKeyPolicy
                    })).Container;

                    await CopyAllAsync(sourceContainer, destContainer, container.PartitionKeyPath.Replace("/", ""));
                }
            }
        }

        public static async Task CopyAllAsync(Container srcContainer, Container destContainer, string pk)
        {
            Console.WriteLine("   Copying " + srcContainer.Id);

            var query = new QueryDefinition($"SELECT DISTINCT value c.{pk} FROM c");

            var list = (await GetListAsync<string>(srcContainer, query)).OrderBy(x => x).ToList();

            for (var i = 0; i < list.Count; i++) {
                Console.Write($"      {i}. {list[i]}");

                if (list[i] == "Sessions") {
                    Console.WriteLine(" Skipping");
                    continue;
                }

                var all = await GetAllByPartitionyAsync<dynamic>(srcContainer, pk, list[i]);
                var count = 0;

                Console.Write($" {all.Count} -> ");

                var tasks = new List<Task>();

                foreach (var x in all) {
                    x.Remove("_rid");
                    x.Remove("_self");
                    x.Remove("_etag");
                    x.Remove("_attachments");
                    x.Remove("_ts");
                    tasks.Add(UpsertAsync(destContainer, x, (string) x[pk]));
                    count++;

                    if (tasks.Count == 10) {
                        await Task.WhenAll(tasks);
                        tasks.Clear();
                    }
                    if (count % 1000 == 0) Console.Write("|");
                    else if (count % 100 == 0) Console.Write(".");
                }
                if (tasks.Count > 0) {
                    await Task.WhenAll(tasks);
                }
                Console.WriteLine(" Done");
            }
        }

        public static Task<List<T>> GetAllByPartitionyAsync<T>(Container container, string pk, string pkValue) {
            var query = new QueryDefinition($"SELECT * FROM c WHERE c.{pk} = @pk");
            query.WithParameter("@pk", pkValue);

            return GetListAsync<T>(container, query);
        }

        public static async Task<List<U>> GetListAsync<U>(Container container, QueryDefinition query) {
            var list = new List<U>();
            var iterator = container.GetItemQueryStreamIterator(query);
            while (iterator.HasMoreResults) {
                var results = await iterator.ReadNextAsync();

                if (results?.Content == null) continue;

                var obj = await Utf8Json.JsonSerializer.DeserializeAsync<Results<U>>(results.Content);

                list.AddRange(obj.Documents);
            }
            return list;
        }

        public static async Task UpsertAsync(Container container, dynamic document, string pk) {
            var response = await container.UpsertItemAsync(document, new PartitionKey(pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured upserting a db object: {response.StatusCode}.");
        }

        private static async Task<List<ContainerProperties>> GetContainerNamesAsync(Database db)
        {
            var list = new List<ContainerProperties>();

            using (var iterator = db.GetContainerQueryIterator<ContainerProperties>())
                while (iterator.HasMoreResults)
                    foreach (var x in await iterator.ReadNextAsync())
                        list.Add(x);

            return list;
        }

        private static async Task<List<string>> GetDatabaseNamesAsync(CosmosClient client)
        {
            var list = new List<string>();

            using (var iterator = client.GetDatabaseQueryIterator<DatabaseProperties>())
                while (iterator.HasMoreResults)
                    foreach (var x in await iterator.ReadNextAsync())
                        list.Add(x.Id);

            return list;
        }

        private static Container CreateContainer(Dictionary<string, string> config) {
            var client = new CosmosClient(config["cs"]);
            return client.GetContainer(config["db"], config["coll"]);
        }
    }

    public class Results<A> {
        public A[] Documents { get; set; }
    }
}