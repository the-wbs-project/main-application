using Microsoft.Extensions.Configuration;
using Wbs.Core.Configuration;

namespace Wbs.Functions.Configuration;

public class DatadogConfig : IDatadogConfig
{
    public DatadogConfig(IConfiguration config)
    {
        ApiUrl = config["ApiUrl"];
        ApiKey = config["ApiKey"];
        LogService = config["LogService"];
        LogEnvironment = config["LogEnvironment"];
        LogSource = config["LogSource"];
    }

    public string ApiUrl { get; private set; }
    public string ApiKey { get; private set; }
    public string LogService { get; private set; }
    public string LogEnvironment { get; private set; }
    public string LogSource { get; private set; }
}