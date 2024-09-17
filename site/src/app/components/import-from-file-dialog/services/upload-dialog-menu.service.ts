import { Injectable } from '@angular/core';
import { ContextMenuItem } from '@wbs/core/models';
import {
  ImportTask,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
} from '../models';

@Injectable()
export class UploadDialogMenuService {
  buildMenu(task: ImportTask | undefined): ContextMenuItem[] {
    if (!task) return [];

    const movers: ContextMenuItem[] = [];

    if (task.canMoveLeft) movers.push(MOVE_LEFT);
    if (task.canMoveRight) movers.push(MOVE_RIGHT);
    if (task.canMoveUp) movers.push(MOVE_UP);
    if (task.canMoveDown) movers.push(MOVE_DOWN);

    return movers;
  }
}
