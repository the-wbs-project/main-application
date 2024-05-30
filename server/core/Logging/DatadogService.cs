using System.Net;
using System.Text;
using System.Text.Json;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.Logging;

public class DatadogService : IDisposable
{
    private readonly Timer timer;
    private readonly IDatadogConfig _config;
    private readonly List<DatadogLog> logs = new List<DatadogLog>();

    public DatadogService(IDatadogConfig config)
    {
        _config = config;

        timer = new Timer(Flush, null, 0, 5000); // 10 seconds (10000ms
    }

    public void AddLog(
        string logLevel,
        string eventId,
        string message,
        Exception exception)
    {
        logs.Add(new DatadogLog
        {
            ddsource = _config.LogSource,
            ddtags = $"env:{_config.LogEnvironment},app:pm-empower",
            service = _config.LogService,
            status = logLevel,
            message = message,
            error = exception == null ? null : new DatadogErrorLog
            {
                message = exception.Message,
                stack = exception.ToString(),
                kind = exception.GetType().ToString()
            },
            session_id = eventId
        });
    }

    public async Task FlushAsync()
    {
        var currentLogs = new List<DatadogLog>(logs);

        if (logs.Count == 0) return;

        logs.Clear();

        try
        {
            using (var client = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    Content = new StringContent(JsonSerializer.Serialize(currentLogs), Encoding.UTF8, "application/json"),
                    RequestUri = new Uri(_config.ApiUrl),
                };

                request.Headers.Add("Accept", "application/json");
                request.Headers.Add("DD-API-KEY", _config.ApiKey);

                var response = await client.SendAsync(request);

                if (response.StatusCode == HttpStatusCode.Accepted)
                {
                    Console.WriteLine("Saved!");
                }
                else
                {
                    Console.WriteLine($"Failed to save: {response.StatusCode}");
                    logs.AddRange(currentLogs);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to save: {ex.Message}");
            logs.AddRange(currentLogs);
        }
    }

    public void Flush(object args)
    {
        Task.Run(() => FlushAsync()).GetAwaiter().GetResult();
    }

    public void Dispose()
    {
        timer.Dispose();
    }
}
/**/
