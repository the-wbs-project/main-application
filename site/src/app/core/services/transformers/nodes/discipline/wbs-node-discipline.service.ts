import { ProjectNode, WbsNode } from '@wbs/core/models';
import {
  CategoryViewModel,
  DisciplineTaskViewModel,
} from '@wbs/core/view-models';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsDisciplineNodeTransformer {
  constructor(private readonly wbsService: WbsNodeService) {}

  run(
    type: 'wbs' | 'abs',
    disciplines: CategoryViewModel[],
    projectNodes: ProjectNode[]
  ): DisciplineTaskViewModel[] {
    const phases = this.wbsService.getPhases(projectNodes);
    const nodes: DisciplineTaskViewModel[] = [];
    let dCounter = 1;

    for (const d of disciplines) {
      const dView: DisciplineTaskViewModel = {
        id: d.id,
        levelText: dCounter.toString(),
        title: d.label,
      };
      const phaseNodes: DisciplineTaskViewModel[] = [];

      let phaseCounter = 1;

      for (const p of phases) {
        const pNode = projectNodes.find((x) => x.id === p.id)!;
        const pLevel = [dCounter, phaseCounter];

        //if ((pNode?.disciplineIds ?? []).indexOf(d.id) === -1) continue;

        const pView: DisciplineTaskViewModel = {
          id: `${d.id}-${p.id}`,
          levelText: pLevel.join('.'),
          parentId: d.id,
          title: pNode.title,
        };

        const children = this.getPhaseChildren(
          type,
          d.id,
          p.id,
          p.id,
          pLevel,
          projectNodes
        );
        const hasDiscipline = pNode.disciplineIds?.includes(d.id) ?? false;
        //
        //  If we have no discipline, and no children, skip it
        //
        if (!hasDiscipline && children.length === 0) continue;

        phaseNodes.push(pView);
        //
        //  IF this is for ABS, and we have hit a ABS node, don't actually add the children
        //
        if (type === 'wbs' || !pNode.absFlag) {
          phaseNodes.push(...children);
        }
        phaseCounter++;
      }
      if (phaseNodes.length > 0) {
        nodes.push(dView, ...phaseNodes);
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
    type: 'wbs' | 'abs',
    disciplineId: string,
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[]
  ): DisciplineTaskViewModel[] {
    const results: DisciplineTaskViewModel[] = [];
    const children = this.getSortedChildren(parentId, list);
    let counter = 1;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parentLevel, counter];
      const node: DisciplineTaskViewModel = {
        id: `${disciplineId}-${child.id}`,
        parentId: `${disciplineId}-${parentId}`,
        title: child.title ?? '',
        levelText: childLevel.join('.'),
      };
      const myChildren = this.getPhaseChildren(
        type,
        disciplineId,
        phaseId,
        child.id,
        childLevel,
        list
      );

      const hasDiscipline = (child.disciplineIds ?? []).includes(disciplineId);

      if (hasDiscipline || myChildren.length > 0) {
        counter++;

        results.push(node, ...myChildren);
      }
    }
    return results;
  }
}
