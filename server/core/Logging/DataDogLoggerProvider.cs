using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Logging;

namespace Wbs.Core.Logging;


public class DataDogLoggerProvider : ILoggerProvider
{
    private readonly LogLevel level = LogLevel.Debug;
    private readonly DatadogService service;
    private readonly ConcurrentDictionary<string, DataDogLogger> loggers;

    public DataDogLoggerProvider(IDatadogConfig ddConfig, string logLevel)
    {
        Enum.TryParse(logLevel, out level);

        service = new DatadogService(ddConfig);
        loggers = new(StringComparer.OrdinalIgnoreCase);
    }

    public ILogger CreateLogger(string categoryName) =>
        loggers.GetOrAdd(categoryName, name => new DataDogLogger(service, level));

    public void Dispose()
    {
        loggers.Clear();
        service.Dispose();
    }
}
