using System.Text.Json;
using Azure.Storage.Queues;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;

namespace Wbs.Core.Services;

public class QueueService
{
    private readonly Timer timer;
    private readonly ILogger logger;
    private readonly IStorageConfig config;
    private readonly Dictionary<string, List<string>> messages = new Dictionary<string, List<string>>();

    public QueueService(IStorageConfig config, ILoggerFactory loggerFactory)
    {
        this.config = config;
        //logger = loggerFactory.CreateLogger<QueueService>();
        //timer = new Timer(Flush, null, 0, 10000); // 10 seconds
    }

    public void Add<T>(string queueName, T message)
    {
        Add(queueName, JsonSerializer.Serialize(message));
    }

    public void Add(string queueName, string message)
    {
        if (messages.ContainsKey(queueName))
        {
            messages[queueName].Add(message);
        }
        else
        {
            messages.Add(queueName, new List<string> { message });
        }
    }

    public void Flush(object args)
    {
        if (messages.Count == 0) return;

        Task.Run(() => FlushAsync()).GetAwaiter().GetResult();
    }

    private async Task FlushAsync()
    {
        var current = new Dictionary<string, List<string>>(messages);

        messages.Clear();

        foreach (var queueName in current.Keys)
        {
            var queue = new QueueClient(config.QueueConnectionString, queueName, new QueueClientOptions
            {
                MessageEncoding = QueueMessageEncoding.Base64
            });

            await queue.CreateIfNotExistsAsync();

            foreach (var message in current[queueName].Distinct())
            {
                try
                {
                    await queue.SendMessageAsync(message);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Failed to add message to queue '{queueName}'");
                }
            }
        }
    }
}
