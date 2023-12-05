namespace Wbs.Api.Configuration;

public class DatabaseConfig
{
    public DatabaseConfig(string sqlConnectionString, string cosmosConnectionString)
    {
        SqlConnectionString = sqlConnectionString;
        CosmosConnectionString = cosmosConnectionString;
    }

    public string SqlConnectionString { get; private set; }
    public string CosmosConnectionString { get; private set; }
}