using System.Text.Json.Serialization;

namespace Wbs.Core.Models;

public class JiraListResponse<T>
{
  public int size { get; set; }
  public int start { get; set; }
  public int limit { get; set; }
  public bool isLastPage { get; set; }
  public JiraLinks _links { get; set; }
  public T[] values { get; set; }
}