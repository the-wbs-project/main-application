import { Injectable } from '@angular/core';
import {
  Activity,
  PROJECT_NODE_VIEW_TYPE,
  WbsNodeView,
} from '@wbs/shared/models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearEditor, EditorViewChanged, NodeSelected } from './actions';
import { EditorView } from './models';

export const VIEWS: EditorView[] = [
  {
    id: 'General',
    label: 'General.General',
  },
  {
    id: 'History',
    label: 'Wbs.History',
  },
  {
    id: 'TrainingMaterial',
    label: 'Wbs.TrainingMaterial',
  },
  {
    id: 'Attachments',
    label: 'Wbs.Attachments',
  },
];

interface StateModel {
  history?: Activity[];
  node?: WbsNodeView;
  projectView?: PROJECT_NODE_VIEW_TYPE;
  view: EditorView;
  views: EditorView[];
}

@Injectable()
@State<StateModel>({
  name: 'nodeEditor',
  defaults: {
    view: VIEWS[0],
    views: VIEWS,
  },
})
export class NodeEditorState {
  @Selector()
  static history(state: StateModel): Activity[] | undefined {
    return state.history;
  }

  @Selector()
  static node(state: StateModel): WbsNodeView | undefined {
    return state.node;
  }

  @Selector()
  static show(state: StateModel): boolean {
    return state.node != undefined;
  }

  @Selector()
  static view(state: StateModel): string {
    return state.view.id;
  }

  @Selector()
  static viewLabel(state: StateModel): string {
    return state.view.label;
  }

  @Selector()
  static views(state: StateModel): EditorView[] {
    return state.views;
  }

  @Action(NodeSelected)
  nodeSelected(ctx: StateContext<StateModel>, action: NodeSelected): void {
    ctx.patchState({
      history: action.history,
      node: action.node,
      projectView: action.view,
    });
  }

  @Action(EditorViewChanged)
  editorViewChanged(
    ctx: StateContext<StateModel>,
    action: EditorViewChanged
  ): void {
    ctx.patchState({
      view: action.view,
    });
  }

  @Action(ClearEditor)
  clearEditor(ctx: StateContext<StateModel>, action: ClearEditor): void {
    ctx.patchState({
      node: undefined,
      view: VIEWS[0],
    });
  }
}
