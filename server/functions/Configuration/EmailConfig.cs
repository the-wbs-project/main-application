using Microsoft.Extensions.Configuration;

namespace Wbs.Functions.Configuration;

public class EmailConfig
{
    public EmailConfig(IConfiguration config)
    {
        ApiKey = config["Email:ApiKey"];
        From = config["Email:From"];
        Domain = config["Email:Domain"];
    }

    public string ApiKey { get; private set; }
    public string From { get; private set; }
    public string Domain { get; private set; }
}