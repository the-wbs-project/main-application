namespace Wbs.Core.Configuration;

public interface IDatabaseConfig
{
    string SqlConnectionString { get; }
    string CosmosConnectionString { get; }
}