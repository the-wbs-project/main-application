using net.sf.mpxj.reader;
using Wbs.Core.Models;

namespace Wbs.Core.Services.Importers;

public class ProjectFileImporter
{
    public UploadResults Run(byte[] file)
    {
        var reader = new UniversalProjectReader();
        var results = new List<ProjectImportResults>();

        using var stream = new java.io.ByteArrayInputStream(file);
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
                Id = IdService.Create(),
                Title = task.getName(),
                LevelText = task.getOutlineNumber(),
                Resources = folks.Where(x => x != null).ToList()
            });
        }
        return new UploadResults
        {
            results = results
        };
    }

    public Dictionary<string, double> GetResources(byte[] file)
    {
        var reader = new UniversalProjectReader();
        var results = new Dictionary<string, double>();

        using var stream = new java.io.ByteArrayInputStream(file);
        var project = reader.read(stream);

        foreach (net.sf.mpxj.Resource resource in project.getResources().toArray())
        {
            var name = resource.getName();

            if (string.IsNullOrWhiteSpace(name)) continue;

            results.Add(name, resource.getStandardRate().getAmount());
        }

        return results;
    }
}
