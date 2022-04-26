namespace Wbs.Utilities.Models
{
    public class Metadata<T> : IDbObject
    {
        public string id { get; set; }
        public string pk {  get; set; }
        public T values { get; set; }   
    }
}
