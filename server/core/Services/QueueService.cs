using System.Text.Json;
using Wbs.Core.Configuration;

namespace Wbs.Core.Services;

public class QueueService
{
    private readonly IStorageConfig config;

    public QueueService(IStorageConfig config)
    {
        this.config = config;
    }

    public async Task AddAsync<T>(string queueName, T message, bool throwException = false)
    {
        await AddAsync(queueName, JsonSerializer.Serialize(message), throwException);
    }

    public async Task AddAsync(string queueName, string message, bool throwException = false)
    {
        try
        {
            var queue = new QueueClient(config.QueueConnectionString, queueName, new QueueClientOptions
            {
                MessageEncoding = QueueMessageEncoding.Base64
            });

            await queue.SendMessageAsync(message);
        }
        catch (Exception ex)
        {
            if (throwException)
            {
                throw new Exception($"Failed to add message to queue '{queueName}'", ex);
            }
        }
    }
}
