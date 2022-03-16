using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace table_copy
{
    class Program {
        private static readonly List<HttpStatusCode> codes = new List<HttpStatusCode> { HttpStatusCode.OK, HttpStatusCode.Created };

        static async Task Main(string[] args) {
            Console.WriteLine(args[0]);
            var fileDir = args[0];

            if (args.Length > 1) Console.WriteLine(args[1]);

            var configFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "config.json"));
            var indexFile = await File.ReadAllTextAsync(Path.Combine(fileDir, "index.json"));
            
            var config = JsonConvert.DeserializeObject<Dictionary<string, string>>(configFile);
            var files = JsonConvert.DeserializeObject<List<string>>(indexFile);

            var client = new CosmosClient(config["cs"]);
            var container = client.GetContainer(config["db"], config["coll"]);

            foreach (var file in files) {
                Console.WriteLine(file);

                var rawFile = await File.ReadAllTextAsync(Path.Combine(fileDir, file));
                dynamic json = JsonConvert.DeserializeObject(rawFile);

                foreach (var obj in json)
                  await UpsertAsync(container, obj);
            }     
        }

        public static async Task UpsertAsync(Container c, dynamic document) {
            var response = await c.UpsertItemAsync(document, new PartitionKey((string)document.pk));

            if (!codes.Contains(response.StatusCode)) throw new Exception($"An error occured upserting a db object: {response.StatusCode}.");
        }
    }
}
