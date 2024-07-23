import { WbsNode } from '@wbs/core/models';
import { CategoryViewModel, TaskViewModel } from '@wbs/core/view-models';
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
  ): TaskViewModel[] {
    const phases = this.wbsService.getPhases(projectNodes);
    const nodes: TaskViewModel[] = [];
    let dCounter = 1;

    for (const d of disciplines) {
      const dView: TaskViewModel = {
        children: 0,
        childrenIds: [],
        disciplines: [d],
        id: d.id,
        treeId: d.id,
        levels: [dCounter],
        levelText: dCounter.toString(),
        depth: 1,
        order: dCounter,
        title: d.label,
        lastModified: undefined,
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
      };

      let phaseCounter = 1;

      for (const p of phases) {
        const pNode = projectNodes.find((x) => x.id === p.id)!;
        const pLevel = [dCounter, phaseCounter];

        //if ((pNode?.disciplineIds ?? []).indexOf(d.id) === -1) continue;

        const pView: TaskViewModel = {
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

      if (dView.children > 0) {
        nodes.push(dView);
        dCounter++;
      }
    }

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
  ): TaskViewModel[] {
    const results: TaskViewModel[] = [];
    const children = this.getSortedChildren(parentId, list);
    let counter = 1;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parentLevel, counter];
      const node: TaskViewModel = {
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

  private getChildCount(children: TaskViewModel[]): number {
    return children
      .map((x) => x.children + 1)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
}
