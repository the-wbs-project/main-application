import {
  LibraryEntryNode,
  ProjectCategory,
  ProjectUploadData,
  WbsImportResult,
  WbsNode,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { BaseImporter } from './base-importer.service';

export class WbsNodeLibraryImporter extends BaseImporter {
  run(
    version: LibraryVersionViewModel,
    existingNodes: WbsNode[],
    action: 'append' | 'overwrite',
    people: Map<string, ProjectCategory>,
    nodes: Map<string, WbsImportResult>
  ): ProjectUploadData<LibraryEntryNode> {
    const results: ProjectUploadData<LibraryEntryNode> = {
      disciplines: this.getDisciplines(version.disciplines ?? [], people),
      removeIds: [],
      upserts: [],
    };
    //
    //  If overwrite, mark all nodes to be deleted
    //
    if (action === 'overwrite') {
      for (const node of existingNodes) {
        if (version.type === 'project' || node.parentId != undefined)
          results.removeIds.push(node.id);
      }
    }
    let rootParentId =
      version.type === 'project'
        ? undefined
        : existingNodes.find((x) => x.parentId == undefined)?.id;

    let counter = 1;
    const rootDelta =
      action === 'overwrite'
        ? 0
        : existingNodes.filter((x) => x.parentId == rootParentId).length;

    while (nodes.has(counter.toString())) {
      const info = nodes.get(counter.toString())!;
      const rootId = IdService.generate();
      //
      //  add the node
      //
      const children = this.getChildren(
        rootId,
        counter.toString(),
        people,
        nodes
      );
      const now = new Date();
      const node: WbsNode = {
        id: rootId,
        order: counter + rootDelta,
        parentId: rootParentId,
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
