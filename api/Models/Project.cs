namespace Wbs.Api.Models;

public class Project
{
    public string id { get; set; }
    public string owner { get; set; }
    public string createdBy { get; set; }
    public DateTimeOffset createdOn { get; set; }
    public DateTimeOffset lastModified { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public string status { get; set; }
    public string mainNodeView { get; set; }
    public string category { get; set; }
    public object[] phases { get; set; }
    public object[] disciplines { get; set; }
    public ProjectRole[] roles { get; set; }
    public bool? approvalStarted { get; set; }
}
