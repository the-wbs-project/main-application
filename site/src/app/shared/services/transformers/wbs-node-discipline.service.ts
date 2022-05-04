import { Store } from '@ngxs/store';
import {
  ListItem,
  Project,
  WbsDisciplineNode,
  WbsNode,
  WbsNodeDisciplineRelationship,
} from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { Resources } from '../resource.service';
import { WbsNodeService } from '../wbs-node.service';

export class WbsDisciplineNodeTransformer {
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

  run(project: Project, projectNodes: WbsNode[]): WbsDisciplineNode[] {
    const nodes: WbsDisciplineNode[] = [];
    const categories = <ListItem[]>(
      project.categories.discipline
        .map((x) => this.disciplineList.find((c) => c.id === x))
        .filter((x) => x)
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const parent: WbsDisciplineNode = {
        children: 0,
        description: null,
        disciplines: null,
        id: cat.id,
        isPhaseNode: false,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        order: i + 1,
        parentId: null,
        phaseId: undefined,
        title: this.resources.get(cat.label),
      };
      const children = this.getChildren(
        cat.id,
        cat.id,
        parentlevel,
        projectNodes
      );
      parent.children = this.getChildCount(children);

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getSortedChildren(
    disciplineId: string,
    parentId: string,
    list: WbsNode[]
  ): [WbsNode, WbsNodeDisciplineRelationship][] {
    const results: [WbsNode, WbsNodeDisciplineRelationship][] = [];

    for (const node of list) {
      if (node.discipline == null || node.removed) continue;

      const r = node.discipline.find(
        (x) => x.disciplineId === disciplineId && x.parentId === parentId
      );

      if (r) results.push([node, r]);
    }

    return results.sort(WbsNodeService.disciplineSort);
  }

  private getChildren(
    disciplineId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[]
  ): WbsDisciplineNode[] {
    const results: WbsDisciplineNode[] = [];

    for (const childParts of this.getSortedChildren(
      disciplineId,
      parentId,
      list
    )) {
      const child = childParts[0];
      const childDisc = childParts[1];
      const childLevel = [...parentLevel, childDisc.order];
      const node: WbsDisciplineNode = {
        id: child.id,
        parentId: parentId,
        disciplines: child.disciplineIds,
        phaseId: childDisc.phaseId,
        order: childDisc.order,
        levels: childLevel,
        title: child.title ?? '',
        description: child.description,
        levelText: childLevel.join('.'),
        children: 0,
        isPhaseNode: childDisc.isPhaseNode,
      };
      if (node.isPhaseNode) {
        const pCat = this.phaseList.find((x) => x.id === childDisc.phaseId);

        if (pCat) node.title = this.resources.get(pCat.label);
      }
      const children = this.getChildren(
        disciplineId,
        child.id,
        childLevel,
        list
      );

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
