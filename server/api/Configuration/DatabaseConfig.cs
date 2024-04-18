using Wbs.Core.Configuration;

namespace Wbs.Api.Configuration;

public class DatabaseConfig : IDatabaseConfig
{
    public DatabaseConfig(IConfiguration config)
    {
        SqlConnectionString = config["Db:ConnectionString:Sql"];
        CosmosConnectionString = config["Db:ConnectionString:Cosmos"];
    }

    public string SqlConnectionString { get; private set; }
    public string CosmosConnectionString { get; private set; }
}