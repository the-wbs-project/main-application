namespace Wbs.Core.Models;

public class BulkSaveRecord<T>
{
    public T[] upserts { get; set; }
    public string[] removeIds { get; set; }
}
