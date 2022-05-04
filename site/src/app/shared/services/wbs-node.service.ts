import { WbsNode, WbsNodeDisciplineRelationship } from '@wbs/shared/models';

export class WbsNodeService {
  static phaseSort = (a: WbsNode, b: WbsNode) =>
    (a.phase?.order ?? 0) < (b.phase?.order ?? 0) ? -1 : 1;

  static disciplineSort = (
    a: [WbsNode, WbsNodeDisciplineRelationship],
    b: [WbsNode, WbsNodeDisciplineRelationship]
  ) => (a[1].order < b[1].order ? -1 : 1);

  static markAsRemoved(nodes: WbsNode[], id: string): WbsNode[] {
    const edited: WbsNode[] = [];
    const node = nodes.find((x) => x.id === id);

    if (node == undefined) return edited;

    node.removed = true;

    edited.push(node);

    return edited;
  }

  static rebuildPhaseSort(nodes: WbsNode[]): void {
    //
  }
}
