import { PROJECT_VIEW_TYPE, WbsNodeView } from '@wbs/models';

export class NodeSelected {
  static readonly type = '[Node Editor] Selected';
  constructor(
    public readonly node: WbsNodeView,
    public readonly view: PROJECT_VIEW_TYPE
  ) {}
}

export class ClearEditor {
  static readonly type = '[Node Editor] Clear';
}
