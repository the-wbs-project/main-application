import { LibraryEntryNode, WbsNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export class WbsNodeService {
  static sort = (a: WbsNode | WbsNodeView, b: WbsNode | WbsNodeView) =>
    (a.order ?? 0) < (b.order ?? 0) ? -1 : 1;

  static getSortedChildrenForPhase(
    parentId: string | undefined,
    list: WbsNode[] | undefined
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }

  static getChildrenIds(tasks: LibraryEntryNode[], taskId: string): string[] {
    const children: string[] = [];

    for (const task of tasks.filter((x) => x.parentId === taskId)) {
      children.push(task.id);
      children.push(...WbsNodeService.getChildrenIds(tasks, task.id));
    }
    return children;
  }
}
