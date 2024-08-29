import { inject } from '@angular/core';
import {
  ProjectCategory,
  ProjectNode,
  ProjectUploadData,
  WbsImportResult,
  WbsNode,
} from '@wbs/core/models';
import { IdService, WbsNodeService } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { BaseImporter } from './base-importer.service';

export class WbsNodePhaseProjectImporter extends BaseImporter {
  private readonly wbsService = inject(WbsNodeService);

  run(
    project: ProjectViewModel,
    existingNodes: WbsNode[],
    action: 'append' | 'overwrite',
    people: Map<string, ProjectCategory>,
    nodes: Map<string, WbsImportResult>
  ): ProjectUploadData<ProjectNode> {
    const results: ProjectUploadData<ProjectNode> = {
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
      const node: ProjectNode = {
        id: phaseId,
        order: counter + phaseDelta,
        title: info.title,
        createdOn: now,
        lastModified: now,
        disciplineIds: this.getDisciplineFromPeople(info, people),
        projectId: project.id,
        absFlag: false,
      };
      const projectChildren: ProjectNode[] = children.map((child) => ({
        ...child,
        projectId: project.id,
        absFlag: false,
      }));

      results.upserts.push(node, ...projectChildren);
      counter++;
    }

    return results;
  }
}
