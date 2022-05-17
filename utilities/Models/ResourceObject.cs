using System.Collections.Generic;

namespace Wbs.Utilities.Models
{
    public class ResourceObject : IIdObject
    {
        public string id { get; set; }
        public string language {  get; set; }
        public Dictionary<string, Dictionary<string, string>> values { get; set; }   
    }
}
