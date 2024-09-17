using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Wbs.Core.DataServices;
using Wbs.Functions.Services;

namespace Wbs.Functions;

public class MailQueue
{
    private readonly DbService db;
    private readonly ILogger _logger;
    private readonly MailgunService mailgunService;

    public MailQueue(ILoggerFactory loggerFactory, DbService db, MailgunService mailgunService)
    {
        _logger = loggerFactory.CreateLogger<MailQueue>();
        this.db = db;
        this.mailgunService = mailgunService;
    }

    [Function("Mail-Test")]
    public async Task RunTest([QueueTrigger("mail-test", Connection = "")] string to)
    {
        try
        {
            await mailgunService.SendEmail(to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing test email");
            throw;
        }
    }
}
