namespace Wbs.Api.Models;

public class RecordResource
{
    public string Id { get; set; }
    public string OwnerId { get; set; }
    public string RecordId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public int Order { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string Resource { get; set; }
    public string Description { get; set; }
}
