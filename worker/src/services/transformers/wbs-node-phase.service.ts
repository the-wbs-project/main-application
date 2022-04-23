import { ListItem, Project, WbsNode, WbsPhaseNode } from '../../models';
import { ResourceService } from '../helpers';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly phaseList: ListItem[],
    private readonly disciplineList: ListItem[],
    private readonly resources: ResourceService,
  ) {}

  run(project: Project): WbsPhaseNode[] {
    const nodes: WbsPhaseNode[] = [];
    const categories = <ListItem[]>(
      project.categories.phase
        .map((x) => this.phaseList.find((c) => c.id === x))
        .filter((x) => x)
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const parent: WbsPhaseNode = {
        id: cat.id,
        parentId: null,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        title: this.resources.get(cat.label),
        order: i + 1,
        children: 0,
        description: null,
        isDisciplineNode: false,
        disciplines: null,
        syncWithDisciplines: false,
        isLockedToParent: false,
      };
      const children = this.getPhaseChildren(
        cat.id,
        parentlevel,
        project.nodes,
        false,
      );
      parent.children = this.getChildCount(children);

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getSortedChildren(
    parentId: string,
    list: WbsNode[] | undefined,
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => !x.removed && x.phase?.parentId === parentId)
      .sort((a, b) => ((a.phase?.order ?? 0) < (b.phase?.order ?? 0) ? -1 : 1));
  }

  private getPhaseChildren(
    parentId: string,
    parentLevel: number[],
    list: WbsNode[] | undefined,
    isLockedToParent: boolean,
  ): WbsPhaseNode[] {
    const results: WbsPhaseNode[] = [];

    for (const child of this.getSortedChildren(parentId, list)) {
      const childLevel = [...parentLevel, child.phase?.order ?? 0];
      console.log(child.disciplineIds);
      const node: WbsPhaseNode = {
        id: child.id,
        parentId: parentId,
        disciplines: child.disciplineIds,
        isDisciplineNode: child.phase?.isDisciplineNode ?? false,
        order: child.phase?.order ?? 0,
        levels: childLevel,
        title: child.title ?? '',
        description: child.description,
        levelText: childLevel.join('.'),
        children: 0,
        syncWithDisciplines: child.phase?.syncWithDisciplines,
        isLockedToParent,
      };
      if (node.isDisciplineNode) {
        const dCat = this.disciplineList.find(
          (x) => x.id === (node.disciplines ?? [])[0],
        );

        if (dCat) node.title = this.resources.get(dCat.label);
      }
      const children = this.getPhaseChildren(
        child.id,
        childLevel,
        list,
        child.phase?.syncWithDisciplines ?? false,
      );

      node.children = this.getChildCount(children);

      results.push(node, ...children);
    }
    return results;
  }

  private getChildCount(children: WbsPhaseNode[]): number {
    return (children ?? [])
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
