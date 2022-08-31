import { ListItem, Project, WbsNode } from '@wbs/shared/models';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsNodePhaseReorderer {
  getMaxOrder(parentId: string, nodes: WbsNode[]): number {
    return Math.max(
      ...nodes.filter((x) => x.parentId === parentId).map((x) => x.order)
    );
  }

  run(project: Project, nodes: WbsNode[]): string[] {
    const changed: string[] = [];
    for (let i = 0; i < project.categories.phase.length; i++) {
      changed.push(
        ...this.reorder(
          [i + 1],
          this.getCatId(project.categories.phase[i]),
          nodes
        )
      );
    }
    return changed;
  }

  private reorder(
    parentLevels: number[],
    parentId: string,
    nodes: WbsNode[]
  ): string[] {
    const changed: string[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parentId, nodes);

    for (var i = 0; i < children.length; i++) {
      const levels = [...parentLevels, i + 1];

      children[i].order = i + 1;

      changed.push(...this.reorder(levels, children[i].id, nodes));
    }
    return changed;
  }

  private getCatId(cat: string | ListItem): string {
    return typeof cat === 'string' ? cat : cat.id;
  }
}
