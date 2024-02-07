import { ProjectCategory, WbsNode } from '@wbs/core/models';
import { WbsNodeService } from '@wbs/main/services';

export class WbsNodePhaseReorderer {
  getMaxOrder(parentId: string, nodes: WbsNode[]): number {
    return Math.max(
      ...nodes.filter((x) => x.parentId === parentId).map((x) => x.order)
    );
  }

  all(phases: ProjectCategory[], nodes: WbsNode[]): string[] {
    const changed: string[] = [];
    for (const phase of phases) {
      changed.push(...this.run(this.getCatId(phase), nodes));
    }
    return changed;
  }

  run(parentId: string, nodes: WbsNode[]): string[] {
    const changed: string[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parentId, nodes);

    for (var i = 0; i < children.length; i++) {
      children[i].order = i + 1;

      changed.push(...this.run(children[i].id, nodes));
    }
    return changed;
  }

  private getCatId(cat: ProjectCategory): string {
    return typeof cat === 'string' ? cat : cat.id;
  }
}
