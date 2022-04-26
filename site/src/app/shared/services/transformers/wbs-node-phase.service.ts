import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode, WbsPhaseNode } from '@wbs/models';
import { MetadataState } from '@wbs/states';
import { Resources } from '../resource.service';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  private get disciplineList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.disciplineCategories);
  }

  private get phaseList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.phaseCategories);
  }

  run(project: Project, projectNodes: WbsNode[]): WbsPhaseNode[] {
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
        children: 0,
        description: null,
        disciplines: null,
        id: cat.id,
        isDisciplineNode: false,
        isLockedToParent: false,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        parentId: null,
        phaseId: cat.id,
        order: i + 1,
        syncWithDisciplines: false,
        title: this.resources.get(cat.label),
      };
      const children = this.getPhaseChildren(
        cat.id,
        cat.id,
        parentlevel,
        projectNodes,
        false
      );
      parent.children = this.getChildCount(children);

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getSortedChildren(
    parentId: string,
    list: WbsNode[] | undefined
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => !x.removed && x.phase?.parentId === parentId)
      .sort((a, b) => ((a.phase?.order ?? 0) < (b.phase?.order ?? 0) ? -1 : 1));
  }

  private getPhaseChildren(
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[] | undefined,
    isLockedToParent: boolean
  ): WbsPhaseNode[] {
    const results: WbsPhaseNode[] = [];

    for (const child of this.getSortedChildren(parentId, list)) {
      const childLevel = [...parentLevel, child.phase?.order ?? 0];
      console.log(child.disciplineIds);
      const node: WbsPhaseNode = {
        children: 0,
        description: child.description,
        disciplines: child.disciplineIds,
        id: child.id,
        isDisciplineNode: child.phase?.isDisciplineNode ?? false,
        isLockedToParent,
        levels: childLevel,
        levelText: childLevel.join('.'),
        order: child.phase?.order ?? 0,
        parentId: parentId,
        phaseId,
        syncWithDisciplines: child.phase?.syncWithDisciplines,
        title: child.title ?? '',
      };
      if (node.isDisciplineNode) {
        const dCat = this.disciplineList.find(
          (x) => x.id === (node.disciplines ?? [])[0]
        );

        if (dCat) node.title = this.resources.get(dCat.label);
      }
      const children = this.getPhaseChildren(
        phaseId,
        child.id,
        childLevel,
        list,
        child.phase?.syncWithDisciplines ?? false
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
