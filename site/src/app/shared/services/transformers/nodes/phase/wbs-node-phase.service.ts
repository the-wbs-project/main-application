import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { WbsNodeView } from '@wbs/shared/view-models';
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

  run(project: Project, projectNodes: WbsNode[]): WbsNodeView[] {
    const nodes: WbsNodeView[] = [];
    const categories = <ListItem[]>(
      project.categories.phase
        .map((x) => this.phaseList.find((c) => c.id === x))
        .filter((x) => x)
    );
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const node = projectNodes.find((x) => x.id === cat.id);
      const parent: WbsNodeView = {
        children: 0,
        description: node?.description ?? null,
        disciplines: node?.disciplineIds ?? [],
        id: cat.id,
        treeId: cat.id,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        parentId: null,
        treeParentId: null,
        phaseId: cat.id,
        order: i + 1,
        title: this.resources.get(cat.label),
        phaseInfo: {
          isDisciplineNode: false,
          isLockedToParent: false,
          syncWithDisciplines: false,
        },
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
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

  private getPhaseChildren(
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[],
    isLockedToParent: boolean
  ): WbsNodeView[] {
    const results: WbsNodeView[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parentId, list);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parentLevel, child.order];
      const node: WbsNodeView = {
        children: 0,
        description: child.description,
        disciplines: child.disciplineIds,
        id: child.id,
        treeId: child.id,
        levels: childLevel,
        levelText: childLevel.join('.'),
        order: child.order ?? 0,
        parentId: parentId,
        treeParentId: parentId,
        phaseId,
        title: child.title ?? '',
        phaseInfo: {
          isDisciplineNode: child.phase?.isDisciplineNode ?? false,
          isLockedToParent,
          syncWithDisciplines: child.phase?.syncWithDisciplines ?? false,
        },
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: childLevel.length > 2,
      };
      if (node.phaseInfo?.isDisciplineNode) {
        const dCat = this.disciplineList.find(
          (x) => x.id === (node.disciplines ?? [])[0]
        );

        if (dCat) node.title = this.resources.get(dCat.label);
      }
      const vmChildren = this.getPhaseChildren(
        phaseId,
        child.id,
        childLevel,
        list,
        child.phase?.syncWithDisciplines ?? false
      );

      node.children = this.getChildCount(vmChildren);

      results.push(node, ...vmChildren);
    }
    return results;
  }

  private getChildCount(children: WbsNodeView[]): number {
    return children
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
