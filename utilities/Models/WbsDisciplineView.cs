using System.Collections.Generic;

namespace Wbs.Utilities.Models
{
    public class WbsDisciplineView : WbsNodeView
    {
        public bool? isPhaseNode { get; set; }
        public List<string> phases { get; set; }
    }
}
