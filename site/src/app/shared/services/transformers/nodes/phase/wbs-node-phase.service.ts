import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { WbsPhaseNodeView } from '@wbs/shared/view-models';
import { Resources } from '../../../resource.service';
import { WbsNodeService } from '../../../wbs-node.service';

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

  run(project: Project, projectNodes: WbsNode[]): WbsPhaseNodeView[] {
    const nodes: WbsPhaseNodeView[] = [];
    const categories = <ListItem[]>(
      project.categories.phase
        .map((x) => this.phaseList.find((c) => c.id === x))
        .filter((x) => x)
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const node = projectNodes.find((x) => x.id === cat.id);
      const parent: WbsPhaseNodeView = {
        children: 0,
        description: node?.description ?? null,
        disciplines: node?.disciplineIds ?? [],
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

      /*for (const child of children)
        for (const dId of child.disciplines ?? [])
          if (parent.disciplines!.indexOf(dId) === -1)
            parent.disciplines!.push(dId);*/

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getSortedChildren(parentId: string, list: WbsNode[]): WbsNode[] {
    return (list ?? [])
      .filter((x) => !x.removed && x.parentId === parentId)
      .sort(WbsNodeService.phaseSort);
  }

  private getPhaseChildren(
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[],
    isLockedToParent: boolean
  ): WbsPhaseNodeView[] {
    const results: WbsPhaseNodeView[] = [];

    for (const child of this.getSortedChildren(parentId, list)) {
      const childLevel = [...parentLevel, child.phase!.order];
      const node: WbsPhaseNodeView = {
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
        syncWithDisciplines: child.phase?.syncWithDisciplines ?? false,
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

  private getChildCount(children: WbsPhaseNodeView[]): number {
    return children
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
