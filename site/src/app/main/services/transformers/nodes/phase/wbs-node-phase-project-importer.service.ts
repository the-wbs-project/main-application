import {
  Project,
  WbsImportResult,
  ProjectUploadData,
  WbsNode,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { BaseImporter } from './base-importer.service';
import { inject } from '@angular/core';
import { WbsNodeService } from '@wbs/main/services/wbs-node.service';

export class WbsNodePhaseProjectImporter extends BaseImporter {
  private readonly wbsService = inject(WbsNodeService);

  run(
    project: Project,
    existingNodes: WbsNode[],
    action: 'append' | 'overwrite',
    people: Map<string, string>,
    nodes: Map<string, WbsImportResult>
  ): ProjectUploadData {
    const results: ProjectUploadData = {
      disciplines: this.getDisciplines(project.disciplines ?? [], people),
      removeIds: [],
      upserts: [],
    };
    const existingPhases = this.wbsService.getPhases(existingNodes);
    //
    //  If overwrite, mark all nodes to be deleted
    //
    if (action === 'overwrite') {
      for (const node of existingNodes) {
        results.removeIds.push(node.id);
      }
    }
    let counter = 1;
    const phaseDelta = action === 'overwrite' ? 0 : existingPhases.length;

    while (nodes.has(counter.toString())) {
      const info = nodes.get(counter.toString())!;
      const phaseId = IdService.generate();
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
