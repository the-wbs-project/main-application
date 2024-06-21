using System.Net.Http.Headers;
using System.Text;
using Wbs.Functions.Configuration;

namespace Wbs.Functions.Services;

public class MailgunService
{
  private readonly EmailConfig config;

  public MailgunService(EmailConfig config)
  {
    this.config = config;
  }

  public async Task SendEmail(string to)
  {
    using var client = new HttpClient();

    var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes("api:" + config.ApiKey));
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(@"Basic", base64String);

    var postData = new MultipartFormDataContent
    {
        { new StringContent(config.From), "from" },
        { new StringContent(to), "to" },
        { new StringContent("Test Email"), "subject" },
        { new StringContent("<b>Hello World!</b>"), "html" }
    };
    using var request = await client.PostAsync($"https://api.mailgun.net/v3/{config.Domain}/messages", postData);
    var response = await request.Content.ReadAsStringAsync();

    Console.WriteLine(response);
  }
}