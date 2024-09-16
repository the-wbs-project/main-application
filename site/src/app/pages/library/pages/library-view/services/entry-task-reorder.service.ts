import { Injectable } from '@angular/core';
import { DropPosition } from '@progress/kendo-angular-treelist';
import {
  DragValidationResults,
  LIBRARY_ENTRY_TYPES,
  LibraryEntryNode,
  RebuildResults,
} from '@wbs/core/models';
import { WbsNodeService } from '@wbs/core/services';
import { TaskViewModel } from '@wbs/core/view-models';

@Injectable()
export class EntryTaskReorderService {
  validate(
    type: string,
    dragged: TaskViewModel,
    target: TaskViewModel,
    dropPosition: DropPosition
  ): DragValidationResults {
    return type === LIBRARY_ENTRY_TYPES.PHASE
      ? this.validatePhase(dragged, target, dropPosition)
      : type === LIBRARY_ENTRY_TYPES.PROJECT
      ? this.validateProject(dragged, target, dropPosition)
      : this.validateTask(dragged, target, dropPosition);
  }

  validateProject(
    dragged: TaskViewModel,
    target: TaskViewModel,
    position: DropPosition
  ): DragValidationResults {
    if (position === 'forbidden') {
      return {
        valid: false,
        errorMessage: 'ReorderMessages.DragUnderItself',
      };
    }
    //
    //  Now check to see if they are trying to turn a phase into a task.
    //    If so they need to confirm this is what they intend.
    //
    const wasPhase = dragged.parentId == undefined;
    const isPhase = position !== 'over' && target.parentId == undefined;

    if (wasPhase && isPhase) {
      return {
        valid: true,
        confirmMessage: 'ReorderMessages.RearrangePhases',
      };
    } else if (wasPhase && !isPhase) {
      return {
        valid: true,
        confirmMessage: 'ReorderMessages.PhaseToTask',
      };
    } else if (isPhase) {
      return {
        valid: true,
        confirmMessage: 'ReorderMessages.TaskToPhase',
      };
    }
    return { valid: true };
  }

  validatePhase(
    dragged: TaskViewModel,
    target: TaskViewModel,
    dropPosition: DropPosition
  ): DragValidationResults {
    if (dropPosition === 'forbidden') {
      return {
        valid: false,
        errorMessage: 'You cannot drop a node under itself.',
      };
    }
    //
    //  Check if the dragged item is a root element, if so it's a no go.
    //
    if (dragged.parentId == undefined) {
      return {
        valid: false,
        errorMessage: "You cannot reorder the root item for task WBS's.",
      };
    }
    //
    //  Check if the dragged item is a root element, if so it's a no go.
    //
    if (target.parentId == undefined && dropPosition !== 'over') {
      return {
        valid: false,
        errorMessage:
          'Sorry, but there can only be one root item for this WBS type.',
      };
    }
    return { valid: true };
  }

  validateTask(
    dragged: TaskViewModel,
    target: TaskViewModel,
    dropPosition: DropPosition
  ): DragValidationResults {
    if (dropPosition === 'forbidden') {
      return {
        valid: false,
        errorMessage: 'You cannot drop a node under itself',
      };
    }
    //
    //  Check if the dragged item is a root element, if so it's a no go.
    //
    if (dragged.parentId == undefined) {
      return {
        valid: false,
        errorMessage: "You cannot reorder the root item for task WBS's.",
      };
    }
    //
    //  Check if the dragged item is a root element, if so it's a no go.
    //
    if (target.parentId == undefined && dropPosition !== 'over') {
      return {
        valid: false,
        errorMessage:
          'Sorry, but there can only be one root item for this WBS type.',
      };
    }
    return { valid: true };
  }

  run(
    tasks: LibraryEntryNode[],
    tree: TaskViewModel[],
    dragged: TaskViewModel,
    target: TaskViewModel,
    position: DropPosition
  ): LibraryEntryNode[] {
    dragged.phaseId = target.phaseId;

    if (position === 'over') {
      //
      //  Set the parent to the target and give this item the last position
      //
      dragged.parentId = target.id;
      dragged.order = target.children + 1;
    } else {
      const delta = position === 'before' ? -0.1 : 0.1;

      dragged.parentId = target.parentId;
      dragged.order = target.order + delta;
    }
    //
    //  If the dragged item has a phase association, ID but also now has a parent ID remove the phase association ID
    //
    if (dragged.phaseIdAssociation && dragged.parentId) {
      dragged.phaseIdAssociation = undefined;
    }

    const index = tree.findIndex((x) => x.id === dragged.id);

    tree.splice(index, 1, dragged);

    const rebuiltResults = this.rebuildLevels(tree);
    const changes: LibraryEntryNode[] = [];

    for (const id of rebuiltResults.changedIds) {
      const node = tasks.find((x) => x.id === id)!;
      const vm = rebuiltResults.rows.find((x) => x.id === id)!;

      node.order = vm.order;
      node.parentId = vm.parentId;
      node.phaseIdAssociation = vm.phaseIdAssociation;

      changes.push(node);
    }
    return changes;
  }

  rebuildLevels(list: TaskViewModel[]): RebuildResults {
    const results: RebuildResults = {
      rows: [],
      changedIds: [],
    };

    const rebuild = (
      parentId: string | undefined,
      parentLevel: number[]
    ): number => {
      const children = this.getSortedVmChildren(parentId, list);
      let count = 0;

      for (let i = 0; i < children.length; i++) {
        let changed = false;
        const child = children[i];

        if (child.order !== i + 1) {
          child.order = i + 1;
          changed = true;
        }
        const level = [...parentLevel, child.order];
        const levelText = level.join('.');

        if (child.levelText !== levelText) {
          child.levels = level;
          child.levelText = levelText;
          changed = true;
        }
        results.rows.push(child);
        const childrenCount = rebuild(child.id, level);

        if (child.children !== childrenCount) {
          child.children = childrenCount;
          changed = true;
        }
        if (child.parentId !== parentId) {
          child.parentId = parentId;
          changed = true;
        }

        count += child.children + 1;

        if (changed) {
          results.changedIds.push(child.id);
        }
      }
      return count;
    };

    rebuild(undefined, []);

    return results;
  }

  private getSortedVmChildren(
    parentId: string | undefined,
    list: TaskViewModel[]
  ): TaskViewModel[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }
}
