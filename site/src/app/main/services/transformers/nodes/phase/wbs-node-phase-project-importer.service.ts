import {
  Project,
  ProjectImportResult,
  ProjectUploadData,
  WbsNode,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { BaseImporter } from './base-importer.service';

export class WbsNodePhaseProjectImporter extends BaseImporter {
  run(
    project: Project,
    existingNodes: WbsNode[],
    action: 'append' | 'overwrite',
    people: Map<string, string>,
    phases: Map<string, string | undefined>,
    nodes: Map<string, ProjectImportResult>
  ): ProjectUploadData {
    const results: ProjectUploadData = {
      disciplines: this.getDisciplines(project.disciplines ?? [], people),
      phases: [],
      removeIds: [],
      upserts: [],
    };
    //
    //  If overwrite, mark all nodes to be deleted
    //
    if (action === 'overwrite') {
      for (const node of existingNodes) {
        results.removeIds.push(node.id);
      }
    } else {
      results.phases = project.phases;
    }
    let counter = 1;
    const phaseDelta = action === 'overwrite' ? 0 : project.phases.length;

    while (nodes.has(counter.toString())) {
      const info = nodes.get(counter.toString())!;
      const phaseId = IdService.generate();
      //
      //  add the phase
      //
      results.phases.push({
        id: phaseId,
        label: info.title,
        sameAs: phases.get(info.title),
      });
      //
      //  add the node
      //
      const children = this.getChildren(
        phaseId,
        counter.toString(),
        people,
        nodes
      );
      const now = new Date();
      const node: WbsNode = {
        id: phaseId,
        order: counter + phaseDelta,
        title: info.title,
        createdOn: now,
        lastModified: now,
        disciplineIds: this.getDisciplineFromPeople(info, people),
      };

      results.upserts.push(node, ...children);
      counter++;
    }

    return results;
  }
}
