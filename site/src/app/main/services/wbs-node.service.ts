import { Injectable, inject } from '@angular/core';
import { LibraryEntryNode, ProjectCategory, WbsNode } from '@wbs/core/models';
import { CategorySelection, WbsNodeView } from '@wbs/core/view-models';
import { CategorySelectionService } from './category-selection.service';

@Injectable()
export class WbsNodeService {
  private readonly categoryService = inject(CategorySelectionService);

  static sort = (a: WbsNode | WbsNodeView, b: WbsNode | WbsNodeView) =>
    (a.order ?? 0) < (b.order ?? 0) ? -1 : 1;

  static getSortedChildrenForPhase(
    parentId: string | undefined,
    list: WbsNode[] | undefined
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }

  static getChildrenIds(tasks: LibraryEntryNode[], taskId: string): string[] {
    const children: string[] = [];

    for (const task of tasks.filter((x) => x.parentId === taskId)) {
      children.push(task.id);
      children.push(...WbsNodeService.getChildrenIds(tasks, task.id));
    }
    return children;
  }

  getPhasesForEdit(
    tasks: WbsNodeView[],
    confirmRemovalMessage: string
  ): CategorySelection[] {
    const counts = new Map<string, number>();
    const phases: ProjectCategory[] = [];
    const taskPhases = tasks
      .filter((x) => x.parentId == undefined)
      .sort((a, b) => a.order - b.order);

    for (const phase of taskPhases) {
      const id = phase.phaseIdAssociation ?? phase.id;

      if (phase.phaseIdAssociation) phases.push(phase.phaseIdAssociation);
      else {
        phases.push({
          id: phase.id,
          label: phase.title,
          description: phase.description,
        });
      }
      counts.set(id, phase.children);
    }

    return this.categoryService.buildPhases(
      phases,
      confirmRemovalMessage,
      counts
    );
  }

  getPhases(tasks: WbsNode[]): ProjectCategory[] {
    const phases: ProjectCategory[] = [];
    const taskPhases = tasks
      .filter((x) => x.parentId == undefined)
      .sort((a, b) => a.order - b.order);

    for (const phase of taskPhases) {
      const id = phase.phaseIdAssociation ?? phase.id;

      if (phase.phaseIdAssociation) phases.push(phase.phaseIdAssociation);
      else {
        phases.push({
          id: phase.id,
          label: phase.title,
          description: phase.description,
        });
      }
    }
    return phases;
  }
}
