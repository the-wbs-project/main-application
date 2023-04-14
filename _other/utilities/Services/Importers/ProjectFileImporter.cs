using net.sf.mpxj.reader;
using System.Collections.Generic;
using Wbs.Utilities.Models;

namespace Wbs.Utilities.Services.Importers
{
    public class ProjectFileImporter
    {
        public UploadResults Run(byte[] file)
        {
            var reader = new UniversalProjectReader();
            var results = new List<ProjectImportResults>();

            using (var stream = new java.io.ByteArrayInputStream(file))
            {
                var project = reader.read(stream);

                foreach (net.sf.mpxj.Task task in project.getTasks().toArray())
                {
                    var assignments = task.getResourceAssignments();
                    var folks = new List<string>();

                    if (assignments.size() > 0)
                    {
                        for (var i = 0; i < assignments.size(); i++)
                        {
                            folks.Add(((net.sf.mpxj.ResourceAssignment)assignments.get(i))?.getResource()?.getName());
                        }
                    }
                    results.Add(new ProjectImportResults
                    {
                        title = task.getName(),
                        levelText = task.getOutlineNumber(),
                        resources = folks
                    });
                }
                return new UploadResults
                {
                    results = results
                };
            }
        }
    }
}
