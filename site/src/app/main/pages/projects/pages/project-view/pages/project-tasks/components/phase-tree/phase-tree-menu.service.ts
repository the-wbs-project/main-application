import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Category, PROJECT_STATI_TYPE, Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { ContextMenuItem } from '@wbs/main/models';
import { PROJECT_TREE_MENU_ITEMS } from '../../../../models';
import { ProjectState } from '../../../../states';
import { MetadataState } from '@wbs/main/services';

declare type Seperator = { separator: true };

@Injectable()
export class PhaseTreeMenuService {
  private readonly metadata = inject(MetadataState);
  private readonly store = inject(Store);

  buildMenu(
    project: Project,
    task: WbsNodeView | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (!task) return [];
    const status = this.store.selectSnapshot(ProjectState.current)!.status;
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
      (task.id === task.phaseId || task.id === task.disciplines[0])
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
    project: Project,
    task: WbsNodeView
  ): ContextMenuItem[] {
    const disciplines = this.metadata.categories.disciplines;
    const results: ContextMenuItem[] = [];

    for (const pDiscipline of project.disciplines) {
      const id = typeof pDiscipline === 'string' ? pDiscipline : pDiscipline.id;

      if (task.disciplines.includes(id)) continue;

      const discipline =
        typeof pDiscipline === 'string'
          ? disciplines.find((x) => x.id === id)
          : pDiscipline;

      if (discipline)
        results.push({
          action: 'addDiscipline|' + id,
          faIcon: discipline.icon ?? 'fa-question',
          text: discipline.label,
          isNotResource: true,
        });
    }

    return results;
  }

  private getDisciplinesToRemove(task: WbsNodeView): ContextMenuItem[] {
    const disciplines = this.metadata.categories.disciplines;
    const results: ContextMenuItem[] = [];

    for (const id of task.disciplines) {
      const discipline = disciplines.find((x) => x.id === id);

      if (discipline)
        results.push({
          action: 'removeDiscipline|' + id,
          faIcon: discipline.icon ?? 'fa-question',
          text: discipline.label,
          isNotResource: true,
        });
    }

    return results;
  }
}
