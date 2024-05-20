import { Injectable, inject } from '@angular/core';
import { ContextMenuItem, LibraryEntryVersion } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { WbsNodeView } from '@wbs/core/view-models';
import { LIBRARY_TREE_MENU_ITEMS } from '../../models';

declare type Seperator = { separator: true };

@Injectable()
export class LibraryTreeMenuService {
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
      claims,
      version.status
    );
    const movers: ContextMenuItem[] = [];

    if (this.canHaveNavActions(entryType, task)) {
      const navActions = this.filterList(
        LIBRARY_TREE_MENU_ITEMS.reorderTaskActions,
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
    claims: string[],
    status: string
  ): ContextMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ContextMenuItem[] = [];

    for (const action of actions) {
      if (this.filterItem(action, claims, status)) {
        results.push(action);
      }
    }

    return results;
  }

  private filterItem(
    link: ContextMenuItem,
    claims: string[],
    status: string
  ): boolean {
    if (!link.filters) return true;
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
        faIcon: discipline.icon ?? 'fa-question',
        text: discipline.label,
        isNotResource: true,
      });
    }

    return results;
  }
}
