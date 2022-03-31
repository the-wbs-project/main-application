import {
  Category,
  Project,
  WbsDisciplineNode,
  WbsNode,
  WbsNodeDisciplineRelationship,
} from '../../models';
import { ResourceService } from '../helpers';

export class WbsDisciplineNodeTransformer {
  constructor(
    private readonly phaseList: Category[],
    private readonly disciplineList: Category[],
    private readonly resources: ResourceService,
  ) {}

  run(project: Project): WbsDisciplineNode[] {
    const nodes: WbsDisciplineNode[] = [];
    const categories = <Category[]>(
      project.categories.discipline
        .map((x) => this.disciplineList.find((c) => c.id === x))
        .filter((x) => x)
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const parent: WbsDisciplineNode = {
        id: cat.id,
        parentId: null,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        title: this.resources.get(cat.label),
        order: i + 1,
        children: 0,
        disciplines: null,
        isPhaseNode: false,
      };
      const children = this.getChildren(cat.id, parentlevel, project.nodes);
      parent.children = this.getChildCount(children);

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getSortedChildren(
    parentId: string,
    list: WbsNode[] | undefined,
  ): [WbsNode, WbsNodeDisciplineRelationship][] {
    const results: [WbsNode, WbsNodeDisciplineRelationship][] = [];

    for (const node of list ?? []) {
      if (node.discipline == null) continue;

      const r = node.discipline.find((x) => x.parentId === parentId);

      if (r) results.push([node, r]);
    }

    return results.sort((a, b) => (a[1].order < b[1].order ? -1 : 1));
  }

  private getChildren(
    parentId: string,
    parentLevel: number[],
    list: WbsNode[] | undefined,
  ): WbsDisciplineNode[] {
    const results: WbsDisciplineNode[] = [];

    for (const childParts of this.getSortedChildren(parentId, list)) {
      const child = childParts[0];
      const childDisc = childParts[1];
      const childLevel = [...parentLevel, childDisc.order];
      const node: WbsDisciplineNode = {
        id: child.id,
        parentId: parentId,
        disciplines: child.disciplineIds,
        order: childDisc.order,
        levels: childLevel,
        title: child.title ?? '',
        levelText: childLevel.join('.'),
        children: 0,
        isPhaseNode: childDisc.isPhaseNode,
      };
      if (node.isPhaseNode) {
        const pCat = this.phaseList.find((x) => x.id === childDisc.phaseId);

        if (pCat) node.title = this.resources.get(pCat.label);
      }
      const children = this.getChildren(child.id, childLevel, list);

      node.children = this.getChildCount(children);

      results.push(node, ...children);
    }
    return results;
  }

  private getChildCount(children: WbsDisciplineNode[]): number {
    return children
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
