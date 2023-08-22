
namespace Wbs.Api.Configuration;

public class AppConfig
{
    public readonly string sqlConnectionString;

    public AppConfig(IConfiguration config)
    {
        sqlConnectionString = config["DbConnection"];
    }
}