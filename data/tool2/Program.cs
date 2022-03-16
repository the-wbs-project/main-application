using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace table_copy {
    class Program {
        private static readonly List<HttpStatusCode> codes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.Created };

        static async Task Main(string[] args) {
            Console.WriteLine(args[0]);
            var fileDir = args[0];
            var env = args[1];

            var srcConfigFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "config.json"));
            var destConfigFile = await File.ReadAllTextAsync(Path.Combine(fileDir, $"config-{env}.json"));

            var srcConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(srcConfigFile);
            var destConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(destConfigFile);

            var source = CreateContainer(srcConfig);
            var destination = CreateContainer(destConfig);

            await CopyAllAsync(source, destination);
        }

        public static async Task CopyAllAsync(Container srcContainer, Container destContainer) {
            var query = new QueryDefinition("SELECT DISTINCT value c.pk FROM c");

            var list = (await GetListAsync<string>(srcContainer, query)).OrderBy(x => x).ToList();

            Console.Write("Skip? ");
            var skip = Console.ReadLine();
            var skip2 = string.IsNullOrWhiteSpace(skip) ? 0 : int.Parse(skip);

            for (var i = skip2; i < list.Count; i++) {
                Console.Write($"{i}. {list[i]}");

                if (list[i] == "Sessions") {
                    Console.WriteLine(" Skipping");
                    continue;
                }

                var all = await GetAllByPartitionyAsync<dynamic>(srcContainer, list[i]);
                var count = 0;

                Console.Write($" {all.Count} -> ");

                var tasks = new List<Task>();

                foreach (var x in all) {
                    x.Remove("_rid");
                    x.Remove("_self");
                    x.Remove("_etag");
                    x.Remove("_attachments");
                    x.Remove("_ts");
                    tasks.Add(UpsertAsync(destContainer, x, (string) x["pk"]));
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

        public static Task<List<T>> GetAllByPartitionyAsync<T>(Container container, string partitionKey = null) {
            var query = new QueryDefinition("SELECT * FROM c WHERE c.pk = @pk");
            query.WithParameter("@pk", partitionKey);

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

        private static Container CreateContainer(Dictionary<string, string> config) {
            var client = new CosmosClient(config["cs"]);
            return client.GetContainer(config["db"], config["coll"]);
        }
    }

    public class Results<A> {
        public A[] Documents { get; set; }
    }
}