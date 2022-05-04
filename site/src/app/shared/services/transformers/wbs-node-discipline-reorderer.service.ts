import {
  Project,
  WbsNode,
  WbsNodeDisciplineRelationship,
} from '@wbs/shared/models';
import { WbsNodeService } from '../wbs-node.service';

export class WbsDisciplineReorderer {
  getMaxOrder(
    disciplineId: string,
    parentId: string,
    nodes: WbsNode[]
  ): number {
    const levels = <WbsNodeDisciplineRelationship[]>(
      nodes
        .map((x) =>
          x.discipline?.find(
            (d) => d.parentId === parentId && d.disciplineId === disciplineId
          )
        )
        .filter((x) => x != null && x != undefined)
    );

    return Math.max(...levels.map((x) => x.order));
  }

  run(project: Project, nodes: WbsNode[]): string[] {
    const changed: string[] = [];
    for (let i = 0; i < project.categories.discipline.length; i++) {
      const cat = project.categories.discipline[i];

      changed.push(...this.reorder(cat, cat, nodes));
    }
    return changed;
  }

  private reorder(
    disciplineId: string,
    parentId: string,
    nodes: WbsNode[]
  ): string[] {
    const changed: string[] = [];
    const children = this.getSortedChildren(disciplineId, parentId, nodes);

    for (var i = 0; i < children.length; i++) {
      const order = i + 1;
      const obj = children[i][1];

      if (obj.order !== order) {
        changed.push(children[i][0].id);
        obj.order = order;
      }
      changed.push(...this.reorder(disciplineId, children[i][0].id, nodes));
    }
    return changed;
  }

  private getSortedChildren(
    disciplineId: string,
    parentId: string,
    list: WbsNode[] | undefined
  ): [WbsNode, WbsNodeDisciplineRelationship][] {
    const results: [WbsNode, WbsNodeDisciplineRelationship][] = [];

    for (const node of list ?? []) {
      if (node.discipline == null || node.removed) continue;

      const r = node.discipline.find(
        (x) => x.disciplineId === disciplineId && x.parentId === parentId
      );

      if (r) results.push([node, r]);
    }

    return results.sort(WbsNodeService.disciplineSort);
  }
}
