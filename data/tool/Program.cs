using System;
using System.Collections.Generic;
using System.IO;
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

            if (args.Length > 1) Console.WriteLine(args[1]);

            var configFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "config.json"));
            var indexFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "index.json"));

            var config = JsonConvert.DeserializeObject<Dictionary<string, string>>(configFile);
            dynamic containers = JsonConvert.DeserializeObject(indexFile);

            var client = new CosmosClient(config["cs"]);

            foreach (var containerInfo in containers) {
                var db = (string) containerInfo.db;
                string coll = (string) containerInfo.col;
                string pk = (string) containerInfo.pk;

                await client.CreateDatabaseIfNotExistsAsync(db);
                await client.GetDatabase(db).CreateContainerIfNotExistsAsync(new ContainerProperties {
                    Id = coll,
                        PartitionKeyPath = $"/{pk}"
                });

                var container = client.GetContainer(db, coll);

                if (containerInfo.files != null)
                    foreach (var file in containerInfo.files) {
                        Console.WriteLine($"Container: {coll}, File: {file}");

                        var rawFile = (await File.ReadAllTextAsync(Path.Combine(fileDir, (string) file)))?.Trim();
                        dynamic json = JsonConvert.DeserializeObject(rawFile);

                        if (rawFile[0] == '[') {
                            foreach (var obj in json)
                                await UpsertAsync(container, obj, (string) obj[pk]);
                        } else {
                            await UpsertAsync(container, json, (string) json[pk]);
                        }
                    }
            }

            if (Directory.Exists("../../worker/kv/KVDATA"))
                foreach (var file in Directory.GetFiles("../../worker/kv/KVDATA"))
                    File.Delete(file);
        }

        public static async Task UpsertAsync(Container c, dynamic document, string pk) {
            var response = await c.UpsertItemAsync(document, new PartitionKey(pk));

            Console.WriteLine(response.StatusCode);

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured upserting a db object: {response.StatusCode}.");
        }
    }
}