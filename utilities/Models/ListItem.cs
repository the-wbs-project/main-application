using System.Collections.Generic;

namespace Wbs.Utilities.Models
{
    public class ListItem : IIdObject
    {
        public string id { get; set; }
        public string type { get; set; }
        public string label { get; set; }
        public List<string> sameAs { get; set; }
        public List<string> tags { get; set; }
    }
}
