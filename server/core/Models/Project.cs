namespace Wbs.Core.Models;

public class Project
{
    public string Id { get; set; }
    public string RecordId { get; set; }
    public string Owner { get; set; }
    public string CreatedBy { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string MainNodeView { get; set; }
    public string Category { get; set; }
    public Category[] Disciplines { get; set; }
    public UserRole[] Roles { get; set; }
    public LibraryLink LibraryLink { get; set; }
    public bool? ApprovalStarted { get; set; }
}
