import { Activity, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { EditorView } from './models';

export class NodeSelected {
  static readonly type = '[Node Editor] Selected';
  constructor(
    readonly node: WbsNodeView,
    readonly view: PROJECT_NODE_VIEW_TYPE,
    readonly history: Activity[] | undefined
  ) {}
}

export class ClosedEditor {
  static readonly type = '[Node Editor] Closed';
}

export class EditorViewChanged {
  static readonly type = '[Node Editor] View Changed';
  constructor(readonly view: EditorView) {}
}

export class DeleteNode {
  static readonly type = '[Node Editor] Delete';
}
