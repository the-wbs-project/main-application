import { WbsNode } from '@wbs/core/models';
import { CategoryViewModel, WbsNodeView } from '@wbs/core/view-models';
import { CategoryService } from '../../../category.service';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsDisciplineNodeTransformer {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly wbsService: WbsNodeService
  ) {}

  run(
    disciplines: CategoryViewModel[],
    projectNodes: WbsNode[]
  ): WbsNodeView[] {
    const phases = this.wbsService.getPhases(projectNodes);
    const nodes: WbsNodeView[] = [];

    for (let i = 0; i < disciplines.length; i++) {
      const d = disciplines[i];

      const dView: WbsNodeView = {
        children: 0,
        childrenIds: [],
        disciplines: [d],
        id: d.id,
        treeId: d.id,
        levels: [i + 1],
        levelText: (i + 1).toString(),
        depth: 1,
        order: i + 1,
        title: d.label,
        lastModified: undefined,
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
        subTasks: [],
      };
      nodes.push(dView);

      let phaseCounter = 1;

      for (const p of phases) {
        const pNode = projectNodes.find((x) => x.id === p.id)!;
        const pLevel = [i + 1, phaseCounter];

        //if ((pNode?.disciplineIds ?? []).indexOf(d.id) === -1) continue;

        const pView: WbsNodeView = {
          children: 0,
          childrenIds: [],
          description: pNode.description,
          disciplines: [d],
          id: p.id,
          treeId: `${d.id}-${p.id}`,
          levels: pLevel,
          levelText: pLevel.join('.'),
          depth: pLevel.length,
          order: phaseCounter,
          parentId: d.id,
          treeParentId: d.id,
          phaseId: p.id,
          title: pNode.title,
          lastModified: pNode?.lastModified,
          canMoveDown: false,
          canMoveUp: false,
          canMoveLeft: false,
          canMoveRight: false,
          subTasks: [],
        };

        const children = this.getPhaseChildren(
          disciplines,
          d.id,
          p.id,
          p.id,
          pLevel,
          projectNodes
        );
        const hasDiscipline = pNode?.disciplineIds?.includes(d.id) ?? false;

        if (!hasDiscipline && children.length === 0) continue;

        pView.children = this.getChildCount(children);

        nodes.push(pView, ...children);
        phaseCounter++;
      }
      dView.children = phaseCounter - 1;
    }

    this.setSameAs(nodes);

    return nodes;
  }

  private getSortedChildren(parentId: string, list: WbsNode[]): WbsNode[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }

  private getPhaseChildren(
    disciplines: CategoryViewModel[],
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
        childrenIds: [],
        parentId: parentId,
        treeId: `${disciplineId}-${child.id}`,
        treeParentId: `${disciplineId}-${parentId}`,
        disciplines: this.categoryService.buildTaskViewModels(
          disciplines,
          child.disciplineIds ?? []
        ),
        phaseId: phaseId,
        order: counter,
        levels: childLevel,
        depth: childLevel.length,
        title: child.title ?? '',
        description: child.description,
        levelText: childLevel.join('.'),
        lastModified: child.lastModified,
        children: 0,
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
        subTasks: [],
      };
      const myChildren = this.getPhaseChildren(
        disciplines,
        disciplineId,
        phaseId,
        child.id,
        childLevel,
        list
      );

      const hasDiscipline = (child.disciplineIds ?? []).includes(disciplineId);

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
