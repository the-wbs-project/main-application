namespace Wbs.Core.Models;

public class Organization
{
    public string Id { get; set; }
    public string Name { get; set; }
    public OrganizationAiConfiguration AiModels { get; set; }
    public bool ProjectApprovalRequired { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}