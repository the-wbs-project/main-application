import { Injectable } from '@angular/core';
import { ContextMenuItem, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { ProjectViewModel, WbsNodeView } from '@wbs/core/view-models';
import { PROJECT_TREE_MENU_ITEMS } from '../../../../models';

declare type Seperator = { separator: true };

@Injectable()
export class PhaseTreeMenuService {
  buildMenu(
    project: ProjectViewModel,
    task: WbsNodeView | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (!task) return [];
    const status = project.status;
    const navActions = this.filterList(
      PROJECT_TREE_MENU_ITEMS.reorderTaskActions,
      task,
      claims,
      status
    );
    const phaseActions = this.filterList(
      PROJECT_TREE_MENU_ITEMS.taskActions,
      task,
      claims,
      status
    );

    const movers: ContextMenuItem[] = [];

    for (const item of navActions) {
      if (item.action === 'moveLeft') {
        if (task.canMoveLeft) movers.push(item);
      } else if (item.action === 'moveRight') {
        if (task.canMoveRight) movers.push(item);
      } else if (item.action === 'moveUp') {
        if (task.canMoveUp) movers.push(item);
      } else if (item.action === 'moveDown') {
        if (task.canMoveDown) movers.push(item);
      }
    }
    //
    //  Now add disciplines
    //
    const add = phaseActions.find((a) => a.action === 'addDiscipline');
    const remove = phaseActions.find((a) => a.action === 'removeDiscipline');

    if (add) {
      add.items = this.getDisciplinesToAdd(project, task);

      if (add.items.length === 0) {
        phaseActions.splice(phaseActions.indexOf(add), 1);
      }
    }

    if (remove) {
      remove.items = this.getDisciplinesToRemove(task);

      if (remove.items.length === 0) {
        phaseActions.splice(phaseActions.indexOf(remove), 1);
      }
    }

    return movers.length === 0
      ? phaseActions
      : [...phaseActions, { separator: true }, ...movers];
  }

  private filterList(
    actions: ContextMenuItem[],
    task: WbsNodeView | undefined,
    claims: string[],
    status: PROJECT_STATI_TYPE
  ): ContextMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ContextMenuItem[] = [];

    for (const action of actions) {
      if (this.filterItem(action, task, claims, status)) {
        results.push(action);
      }
    }

    return results;
  }

  private filterItem(
    link: ContextMenuItem,
    task: WbsNodeView | undefined,
    claims: string[],
    status: PROJECT_STATI_TYPE
  ): boolean {
    if (!link.filters) return true;
    //
    //  Perform cat check
    //
    if (
      task &&
      link.filters.excludeFromCat &&
      (task.id === task.phaseId || task.id === task.disciplines[0].id)
    )
      return false;

    if (link.filters.claim && !claims.includes(link.filters.claim))
      return false;

    if (link.filters.stati) {
      const statusResult = link.filters.stati.some((s) => s === status);

      if (!statusResult) return false;
    }

    return true;
  }

  private getDisciplinesToAdd(
    project: ProjectViewModel,
    task: WbsNodeView
  ): ContextMenuItem[] {
    const existing = task.disciplines.map((x) => x.id);
    const results: ContextMenuItem[] = [];

    for (const discipline of project.disciplines) {
      if (existing.includes(discipline.id)) continue;

      results.push({
        action: 'addDiscipline|' + discipline.id,
        faIcon: discipline.icon ?? 'fa-question',
        text: discipline.label,
        isNotResource: true,
      });
    }

    return results;
  }

  private getDisciplinesToRemove(task: WbsNodeView): ContextMenuItem[] {
    const results: ContextMenuItem[] = [];

    for (const discipline of task.disciplines) {
      results.push({
        action: 'removeDiscipline|' + discipline.id,
        faIcon: discipline.icon,
        text: discipline.label,
        isNotResource: true,
      });
    }

    return results;
  }
}
