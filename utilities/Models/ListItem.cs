using System.Collections.Generic;

namespace Wbs.Utilities.Models
{
    public class ListItem
    {
        public string id { get; set; }
        public string label { get; set; }
        public List<string> sameAs { get; set; }
        public List<string> tags { get; set; }
    }
}
