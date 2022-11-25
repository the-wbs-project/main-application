using System.Collections.Generic;

namespace Wbs.Utilities.Models
{
    public class UploadResults
    {
        public List<string> errors { get; set; }
        public List<ProjectImportResults> results { get; set; }
    }
}