using Microsoft.Extensions.Configuration;
using System;

namespace Wbs.Utilities.Configuration
{
    public class AppConfig
    {
        public AppConfig(IConfiguration config)
        {
            this.config = config;
            cosmos = new CosmosDatabaseConfiguration(GetSection("DB").GetSection("Cosmos"));

            storageConnectionString = Get("AzureWebJobsStorage");
        }

        public CosmosDatabaseConfiguration cosmos { get; set; }
        public IConfiguration config { get; private set; }
        public string storageConnectionString { get; set; }

        private string Get(string name)
        {
            return config[name] ?? Environment.GetEnvironmentVariable(name);
        }

        private IConfigurationSection GetSection(string name)
        {
            return config.GetSection(name);
        }
    }
}