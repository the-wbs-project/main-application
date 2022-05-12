import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { WbsPhaseNodeView } from '@wbs/shared/view-models';
import { Resources } from '../../../resource.service';
import { WbsNodeService } from '../../../wbs-node.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';

export class WbsNodePhaseOppositeRebuilder {
  private readonly viewTransformer: WbsNodePhaseTransformer;

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {
    this.viewTransformer = new WbsNodePhaseTransformer(resources, store);
  }

  private get disciplineList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.disciplineCategories);
  }

  private get phaseList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.phaseCategories);
  }

  run(project: Project, projectNodes: WbsNode[]): string[] {
    const changedIds: string[] = [];
    const phases = <ListItem[]>(
      project.categories.phase
        .map((x) => this.phaseList.find((c) => c.id === x))
        .filter((x) => x)
    );
    const disciplines = <ListItem[]>(
      project.categories.discipline
        .map((x) => this.disciplineList.find((c) => c.id === x))
        .filter((x) => x)
    );

    const views = this.viewTransformer.run(project, projectNodes);

    for (let i = 0; i < project.categories.discipline.length; i++) {
      const d = project.categories.discipline[i];
      const dId = typeof d === 'string' ? d : d.id;
      const parentlevel = [i + 1];
      let phaseCounter = 1;

      for (const phaseId of project.categories.phase) {
        const view = views.find((x) => x.id === phaseId)!;

        if (view.disciplines?.indexOf(dId) === -1) continue;

        const phaseLevel = [...parentlevel, phaseCounter];

        phaseCounter++;
      }
    }
    return changedIds;
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
