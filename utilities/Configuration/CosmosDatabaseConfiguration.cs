using Microsoft.Extensions.Configuration;

namespace Wbs.Utilities.Configuration
{
    public class CosmosDatabaseConfiguration
    {
        public CosmosDatabaseConfiguration() { }

        public CosmosDatabaseConfiguration(IConfiguration config)
        {
            connectionString = config["ConnectionString"];
            databaseId = config["DatabaseId"];
        }

        public string connectionString { get; set; }

        public string databaseId { get; set; }
    }
}
