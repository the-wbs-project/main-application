import { Injectable, inject } from '@angular/core';
import { ActionContextMenuItem, ContextMenuItem } from '@wbs/core/models';
import { MenuService } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { LibraryVersionViewModel, TaskViewModel } from '@wbs/core/view-models';
import { LIBRARY_TREE_MENU_ITEMS } from '../models';

declare type Seperator = { separator: true };

@Injectable()
export class LibraryTreeMenuService {
  private readonly metadata = inject(MetadataStore);
  private readonly menuService = inject(MenuService);

  buildMenu(
    version: LibraryVersionViewModel,
    task: TaskViewModel | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (task === undefined) return [];

    const phaseActions = this.menuService.filterList(
      this.preFilterActions(
        LIBRARY_TREE_MENU_ITEMS.taskActions,
        version.type,
        task
      ),
      claims,
      version.status,
      version
    );
    const movers: ActionContextMenuItem[] = [];

    if (this.canHaveNavActions(version.type, task)) {
      const navActions = this.menuService.filterList(
        LIBRARY_TREE_MENU_ITEMS.reorderTaskActions,
        claims,
        version.status,
        version
      );
      for (const item of navActions) {
        if (item.action === 'moveLeft' && task.canMoveLeft) movers.push(item);
        else if (item.action === 'moveRight' && task.canMoveRight)
          movers.push(item);
        else if (item.action === 'moveUp' && task.canMoveUp) movers.push(item);
        else if (item.action === 'moveDown' && task.canMoveDown)
          movers.push(item);
      }
    }
    //
    //  Now add disciplines
    //
    const add = phaseActions.find((a) => a.action === 'addDiscipline');
    const remove = phaseActions.find((a) => a.action === 'removeDiscipline');

    if (add) {
      add.items = this.getDisciplinesToAdd(version, task);

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

  private preFilterActions(
    items: ActionContextMenuItem[],
    entryType: string,
    task: TaskViewModel
  ): ActionContextMenuItem[] {
    const filter = entryType !== 'project' && task.parentId == undefined;

    if (!filter) return items;

    return items.filter(
      (x) => x.action !== 'cloneTask' && x.action !== 'deleteTask'
    );
  }

  private canHaveNavActions(entryType: string, task: TaskViewModel): boolean {
    return entryType === 'project' || task.parentId != undefined;
  }

  private getDisciplinesToAdd(
    version: LibraryVersionViewModel,
    task: TaskViewModel
  ): ContextMenuItem[] {
    const disciplines = this.metadata.categories.disciplines;
    const existing = task.disciplines.map((x) => x.id);
    const results: ContextMenuItem[] = [];

    for (const vDiscipline of version.disciplines) {
      if (existing.includes(vDiscipline.id)) continue;

      const discipline = vDiscipline.isCustom
        ? vDiscipline
        : disciplines.find((x) => x.id === vDiscipline.id);

      if (discipline)
        results.push({
          action: 'addDiscipline|' + vDiscipline.id,
          faIcon: discipline.icon ?? 'fa-question',
          text: discipline.label,
        });
    }

    return results;
  }

  private getDisciplinesToRemove(task: TaskViewModel): ContextMenuItem[] {
    const results: ContextMenuItem[] = [];

    for (const discipline of task.disciplines) {
      results.push({
        action: 'removeDiscipline|' + discipline.id,
        faIcon: discipline.icon ?? 'fa-question',
        text: discipline.label,
      });
    }

    return results;
  }
}
