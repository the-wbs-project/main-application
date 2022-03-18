import { Project, PROJECT_VIEW, PROJECT_VIEW_TYPE, WbsNode } from '@app/models';
import { ProjectViewModel, WbsNodeViewModel } from '@app/view-models';

export class Transformer {
  static project(project: Project): ProjectViewModel | null {
    return null;
  }

  static wbsNodeTree(
    view: PROJECT_VIEW_TYPE,
    list: WbsNode[]
  ): WbsNodeViewModel[] {
    const nodes: WbsNodeViewModel[] = [];

    for (const node of list) {
      const levels =
        (view === PROJECT_VIEW.DISCIPLINE ? node.levels.d : node.levels.p) ??
        [];

      nodes.push({
        activity: node.activity,
        depth: levels.length,
        id: node.id,
        level: levels.join('.'),
        levels,
        referenceId: node.referenceId,
        thread: node.thread,
        title: node.title,
        trainingId: node.trainingId,
      });
    }
    const toReturn: WbsNodeViewModel[] = [];
    for (const topLevel of nodes.filter((x) => x.depth === 1)) {
      this.addWbsChildren(topLevel, nodes);
      toReturn.push(topLevel);
    }
    return this.sortWbsNodes(toReturn, 1);
  }

  static addWbsChildren(
    node: WbsNodeViewModel,
    list: WbsNodeViewModel[]
  ): void {
    const children = list.filter(
      (x) => x.depth === node.depth + 1 && x.level.startsWith(node.level + '.')
    );

    if (children.length > 0) {
      for (const child of children) {
        this.addWbsChildren(child, list);
      }
      node.children = this.sortWbsNodes(children, node.depth + 1);
    } else {
      node.children = null;
    }
  }

  static sortWbsNodes(
    list: WbsNodeViewModel[],
    depth: number
  ): WbsNodeViewModel[] {
    return list.sort((a, b) =>
      a.levels[depth - 1] < b.levels[depth - 1] ? -1 : 1
    );
  }
}
