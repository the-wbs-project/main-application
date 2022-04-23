import {
  Activity,
  ListItem,
  PROJECT_VIEW_TYPE,
  WbsNodeView,
} from '@wbs/models';
import { EditorView } from './models';

export class LoadDeleteReasons {
  static readonly type = '[Node Editor] Load Delete Reasons';
  constructor(public readonly reasons: ListItem[]) {}
}

export class NodeSelected {
  static readonly type = '[Node Editor] Selected';
  constructor(
    readonly node: WbsNodeView,
    readonly view: PROJECT_VIEW_TYPE,
    readonly history: Activity[] | undefined
  ) {}
}

export class ClearEditor {
  static readonly type = '[Node Editor] Clear';
}

export class EditorViewChanged {
  static readonly type = '[Node Editor] View Changed';
  constructor(readonly view: EditorView) {}
}

export class DeleteNode {
  static readonly type = '[Node Editor] Delete';
}
