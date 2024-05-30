using Microsoft.Extensions.Configuration;
using Wbs.Core.Configuration;

namespace Wbs.Functions.Configuration;

public class DatadogConfig : IDatadogConfig
{
    public DatadogConfig(IConfigurationRoot config)
    {
        var section = config.GetSection("Datadog");

        ApiUrl = section["ApiUrl"];
        ApiKey = section["ApiKey"];
        LogService = section["LogService"];
        LogEnvironment = section["LogEnvironment"];
        LogSource = section["LogSource"];
    }

    public string ApiUrl { get; private set; }
    public string ApiKey { get; private set; }
    public string LogService { get; private set; }
    public string LogEnvironment { get; private set; }
    public string LogSource { get; private set; }
}