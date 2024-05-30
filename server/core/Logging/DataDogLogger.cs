
using Microsoft.Extensions.Logging;
using Wbs.Core.Services;

namespace Wbs.Core.Logging;

public sealed class DataDogLogger : ILogger
{
    private readonly LogLevel level;
    private readonly DatadogService service;

    public DataDogLogger(DatadogService service, LogLevel level)
    {
        this.service = service;
        this.level = level;
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

        service.AddLog(logLevel.ToString(), eventId.ToString(), formatter(state, exception), exception);
    }
}
