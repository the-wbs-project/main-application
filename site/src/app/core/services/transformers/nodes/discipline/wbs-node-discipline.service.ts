import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { Resources } from '../../../resource.service';
import { WbsNodeService } from '../../../wbs-node.service';

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

  run(project: Project, projectNodes: WbsNode[]): WbsNodeView[] {
    const dList = this.disciplineList;
    const pList = this.phaseList;
    const disciplines: ListItem[] = [];
    const phases: ListItem[] = [];

    for (const d of project.categories.discipline) {
      if (typeof d === 'string') {
        const d2 = dList.find((c) => c.id === d);

        if (d2) disciplines.push(d2);
      } else disciplines.push(d);
    }

    for (const p of project.categories.phase) {
      if (typeof p === 'string') {
        const p2 = pList.find((c) => c.id === p);

        if (p2) phases.push(p2);
      } else phases.push(p);
    }

    return this.fromPhaseFirst(projectNodes, disciplines, phases);
  }

  private fromPhaseFirst(
    projectNodes: WbsNode[],
    disciplines: ListItem[],
    phases: ListItem[]
  ): WbsNodeView[] {
    const nodes: WbsNodeView[] = [];

    for (let i = 0; i < disciplines.length; i++) {
      const d = disciplines[i];

      const dNode = projectNodes.find((x) => x.id === d.id);
      const dView: WbsNodeView = {
        children: 0,
        description: dNode?.description,
        disciplines: [d.id],
        id: d.id,
        treeId: d.id,
        levels: [i + 1],
        levelText: (i + 1).toString(),
        order: i + 1,
        parentId: null,
        treeParentId: null,
        phaseId: undefined,
        title: this.resources.get(d.label),
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
      };
      nodes.push(dView);

      let phaseCounter = 1;

      for (const p of phases) {
        const pNode = projectNodes.find((x) => x.id === p.id);
        const pLevel = [i + 1, phaseCounter];

        //if ((pNode?.disciplineIds ?? []).indexOf(d.id) === -1) continue;

        const pView: WbsNodeView = {
          children: 0,
          description: pNode?.description,
          disciplines: [d.id],
          id: p.id,
          treeId: `${d.id}-${p.id}`,
          levels: pLevel,
          levelText: pLevel.join('.'),
          order: phaseCounter,
          parentId: d.id,
          treeParentId: d.id,
          phaseId: p.id,
          title: this.resources.get(p.label),
          canMoveDown: false,
          canMoveUp: false,
          canMoveLeft: false,
          canMoveRight: false,
        };

        const children = this.getPhaseChildren(
          d.id,
          p.id,
          p.id,
          pLevel,
          projectNodes
        );
        if (children.length === 0) continue;

        pView.children = this.getChildCount(children);

        nodes.push(pView, ...children);
        phaseCounter++;
      }
      dView.children = phaseCounter;
    }

    this.setSameAs(nodes);

    return nodes;
  }

  private getSortedChildren(parentId: string, list: WbsNode[]): WbsNode[] {
    return list
      .filter((x) => !x.removed && x.parentId === parentId)
      .sort(WbsNodeService.sort);
    //&& (x.disciplineIds ?? []).indexOf(disciplineId) > -1
  }

  private getPhaseChildren(
    disciplineId: string,
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[]
  ): WbsNodeView[] {
    const results: WbsNodeView[] = [];
    const children = this.getSortedChildren(parentId, list);
    let counter = 1;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parentLevel, counter];
      const node: WbsNodeView = {
        id: child.id,
        parentId: parentId,
        treeId: `${disciplineId}-${child.id}`,
        treeParentId: `${disciplineId}-${parentId}`,
        disciplines: child.disciplineIds,
        phaseId: phaseId,
        order: counter,
        levels: childLevel,
        title: child.title ?? '',
        description: child.description,
        levelText: childLevel.join('.'),
        children: 0,
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
      };
      const myChildren = this.getPhaseChildren(
        disciplineId,
        phaseId,
        child.id,
        childLevel,
        list
      );

      const hasDiscipline =
        (node.disciplines ?? [])?.indexOf(disciplineId) > -1;

      if (hasDiscipline || myChildren.length > 0) {
        node.children = this.getChildCount(myChildren);
        counter++;

        results.push(node, ...myChildren);
      }
    }
    return results;
  }

  private setSameAs(rows: WbsNodeView[]): void {
    const vals = new Map<string, [string, string, number]>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (vals.has(row.id)) {
        const parts = vals.get(row.id)!;

        row.sameAsId = parts[0];
        row.sameAsIndex = parts[2];
        row.sameAsLevelText = parts[1];
      } else {
        vals.set(row.id, [row.treeId, row.levelText, i]);
      }
    }
  }

  private getChildCount(children: WbsNodeView[]): number {
    return children
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
