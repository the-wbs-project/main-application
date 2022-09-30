using Microsoft.Extensions.Configuration;

namespace Wbs.Utilities.Configuration
{
    public class CosmosDatabaseConfiguration
    {
        public CosmosDatabaseConfiguration() { }

        public CosmosDatabaseConfiguration(IConfiguration config)
        {
            connectionString = config["ConnectionString"];
            metadataDb = config["MetadataDb"];
        }

        public string connectionString { get; set; }

        public string metadataDb { get; set; }
    }
}
