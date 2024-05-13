import { Injectable, inject } from '@angular/core';
import { ContextMenuItem, LibraryEntryVersion } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { MetadataStore } from '@wbs/store';
import { LIBRARY_TREE_MENU_ITEMS } from '../models';

declare type Seperator = { separator: true };

@Injectable()
export class EntryTreeMenuService {
  private readonly metadata = inject(MetadataStore);

  buildMenu(
    entryType: string,
    version: LibraryEntryVersion,
    task: WbsNodeView | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (task === undefined) return [];

    const phaseActions = this.filterList(
      this.preFilterActions(
        LIBRARY_TREE_MENU_ITEMS.taskActions,
        entryType,
        task
      ),
      task,
      claims,
      version.status
    );
    const movers: ContextMenuItem[] = [];

    if (this.canHaveNavActions(entryType, task)) {
      const navActions = this.filterList(
        LIBRARY_TREE_MENU_ITEMS.reorderTaskActions,
        task,
        claims,
        version.status
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

  private filterList(
    actions: ContextMenuItem[],
    task: WbsNodeView | undefined,
    claims: string[],
    status: string
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
    status: string
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

  private preFilterActions(
    items: ContextMenuItem[],
    entryType: string,
    task: WbsNodeView
  ): ContextMenuItem[] {
    const filter = entryType !== 'project' && task.parentId == undefined;

    if (!filter) return items;

    return items.filter(
      (x) => x.action !== 'cloneTask' && x.action !== 'deleteTask'
    );
  }

  private canHaveNavActions(entryType: string, task: WbsNodeView): boolean {
    return entryType === 'project' || task.parentId != undefined;
  }

  private getDisciplinesToAdd(
    version: LibraryEntryVersion,
    task: WbsNodeView
  ): ContextMenuItem[] {
    const disciplines = this.metadata.categories.disciplines;
    const results: ContextMenuItem[] = [];

    for (const vDiscipline of version.disciplines) {
      const id = typeof vDiscipline === 'string' ? vDiscipline : vDiscipline.id;

      if (task.disciplines.includes(id)) continue;

      const discipline =
        typeof vDiscipline === 'string'
          ? disciplines.find((x) => x.id === id)
          : vDiscipline;

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
