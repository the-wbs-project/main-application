
using Microsoft.Extensions.Logging;

namespace Wbs.Core.Logging;

public sealed class DataDogLogger : ILogger
{
    private readonly string loggerName;
    private readonly LogLevel level;
    private readonly DatadogService service;

    public DataDogLogger(DatadogService service, string loggerName, LogLevel level)
    {
        this.service = service;
        this.level = level;
        this.loggerName = loggerName;
    }
    public IDisposable BeginScope<TState>(TState state) where TState : notnull => default!;

    public bool IsEnabled(LogLevel logLevel) => logLevel >= level;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception exception,
        Func<TState, Exception, string> formatter)
    {
        if (!IsEnabled(logLevel)) return;

        service.AddLog(loggerName, logLevel.ToString(), eventId.ToString(), formatter(state, exception), state, exception);
    }
}
