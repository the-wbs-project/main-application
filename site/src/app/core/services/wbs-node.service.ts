import { WbsNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export class WbsNodeService {
  static sort = (a: WbsNode | WbsNodeView, b: WbsNode | WbsNodeView) =>
    (a.order ?? 0) < (b.order ?? 0) ? -1 : 1;

  static markAsRemoved(nodes: WbsNode[], id: string): WbsNode[] {
    const edited: WbsNode[] = [];
    const node = nodes.find((x) => x.id === id);

    if (node == undefined) return edited;

    node.removed = true;

    edited.push(node);

    return edited;
  }

  static getSortedChildrenForPhase(
    parentId: string,
    list: WbsNode[] | undefined
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => !x.removed && x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }
}
