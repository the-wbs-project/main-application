import { Injectable } from '@angular/core';
import { ContextMenuItem, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { ProjectTaskViewModel, ProjectViewModel } from '@wbs/core/view-models';
import { PROJECT_TREE_MENU_ITEMS } from '../models';

declare type Seperator = { separator: true };

@Injectable()
export class PhaseTreeMenuService {
  buildMenu(
    project: ProjectViewModel,
    task: ProjectTaskViewModel | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (!task) return [];
    const status = project.status;
    const navActions = this.filterList(
      structuredClone(PROJECT_TREE_MENU_ITEMS.reorderTaskActions),
      task,
      claims,
      status
    );
    const phaseActions = this.filterList(
      structuredClone(PROJECT_TREE_MENU_ITEMS.taskActions),
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
    task: ProjectTaskViewModel,
    claims: string[],
    status: PROJECT_STATI_TYPE
  ): ContextMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    return actions.filter((x) => this.filterItem(x, task, claims, status));
  }

  private filterItem(
    link: ContextMenuItem,
    task: ProjectTaskViewModel,
    claims: string[],
    status: PROJECT_STATI_TYPE
  ): boolean {
    if (link.filters) {
      if (link.filters.claim && !claims.includes(link.filters.claim))
        return false;

      if (link.filters.stati) {
        const statusResult = link.filters.stati.some((s) => s === status);

        if (!statusResult) return false;
      }
      if (link.filters.props) {
        for (const test of link.filters.props) {
          const propResult = Utils.executeTestByObject(task, test);

          if (!propResult) return false;
        }
      }
    }
    if (link.items) {
      link.items = this.filterList(link.items, task, claims, status);
    }

    return true;
  }

  private getDisciplinesToAdd(
    project: ProjectViewModel,
    task: ProjectTaskViewModel
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

  private getDisciplinesToRemove(
    task: ProjectTaskViewModel
  ): ContextMenuItem[] {
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
