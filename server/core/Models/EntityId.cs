namespace Wbs.Core.Models;

public class EntityId
{
    public EntityId() { }
    public EntityId(string ownerId, string id)
    {
        OwnerId = ownerId;
        Id = id;
    }
    public string OwnerId { get; set; }
    public string Id { get; set; }
}