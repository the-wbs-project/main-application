import { Injectable } from '@angular/core';
import { PROJECT_VIEW_TYPE, WbsNodeView } from '@wbs/models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearEditor, NodeSelected } from '../actions';
import { EditorView } from '../models';

export const VIEWS: EditorView[] = [
  {
    id: 'General',
    label: 'WbsEditor.General',
  },
];

interface StateModel {
  node?: WbsNodeView;
  projectView?: PROJECT_VIEW_TYPE;
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
      node: action.node,
      projectView: action.view,
    });
  }

  @Action(ClearEditor)
  clearEditor(ctx: StateContext<StateModel>, action: ClearEditor): void {
    ctx.patchState({
      node: undefined,
      view: undefined,
    });
  }
}
