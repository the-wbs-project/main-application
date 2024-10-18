import { Injectable, inject } from '@angular/core';
import { ActionContextMenuItem, ContextMenuItem } from '@wbs/core/models';
import { MenuService } from '@wbs/core/services';
import { TaskViewModel } from '@wbs/core/view-models';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { ExportToLibraryDialogComponent } from '../components/export-to-library-dialog';
import { LIBRARY_TREE_MENU_ITEMS } from '../models';
import { LibraryStore } from '../store';
import { LibraryImportService } from './library-import.service';
import { LibraryTaskService } from './library-task.service';

declare type Seperator = { separator: true };

@Injectable()
export class LibraryTaskActionService {
  private readonly dialogService = inject(DialogService);
  private readonly importService = inject(LibraryImportService);
  private readonly menuService = inject(MenuService);
  private readonly store = inject(LibraryStore);
  private readonly taskService = inject(LibraryTaskService);

  buildMenu(task: TaskViewModel | undefined): (ContextMenuItem | Seperator)[] {
    if (task === undefined) return [];

    const version = this.store.version()!;
    const claims = this.store.claims();

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

    return movers.length === 0
      ? phaseActions
      : [...phaseActions, { separator: true }, ...movers];
  }

  handleAction(action: string, taskId: string): Observable<any> | void {
    if (action === 'moveLeft') {
      return this.taskService.moveTaskLeft(taskId);
    } else if (action === 'moveUp') {
      return this.taskService.moveTaskUp(taskId);
    } else if (action === 'moveRight') {
      return this.taskService.moveTaskRight(taskId);
    } else if (action === 'moveDown') {
      return this.taskService.moveTaskDown(taskId);
    } else if (action === 'deleteTask') {
      return this.taskService.removeTask(taskId);
    } else if (action === 'cloneTask') {
      return this.taskService.cloneTask(taskId);
    } else if (action === 'export') {
      ExportToLibraryDialogComponent.launch(this.dialogService, taskId);
    } else if (action.startsWith('import|file')) {
      return this.importService.importFromFileAsync(taskId);
    } else if (action.startsWith('import|library')) {
      return this.importService.importFromLibraryAsync(taskId);
    }
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
}
