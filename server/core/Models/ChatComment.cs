namespace Wbs.Core.Models;

public class ChatComment
{
    public string threadId { get; set; }
    public DateTimeOffset timestamp { get; set; }
    public string author { get; set; }
    public string text { get; set; }
}
