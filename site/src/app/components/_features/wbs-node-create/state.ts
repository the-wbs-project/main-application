import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { PROJECT_VIEW_TYPE, WbsNodeView } from '@wbs/models';
import { ContainerService, Resources } from '@wbs/services';
import {
  CloseNodeCreationDialog,
  DialogViewSelected,
  NameDescriptionNext,
  NameDescriptionPrevious,
  OpenNodeCreationDialog,
} from './actions';
import { WbsCreateComponent } from './components';
import { NODE_CREATION_PAGES, NODE_CREATION_PAGES_TYPE } from './models';

interface StateModel {
  nodeDescription: string;
  nodeName: string;
  open: boolean;
  page: NODE_CREATION_PAGES_TYPE;
  parent?: WbsNodeView;
  view?: PROJECT_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'nodeCreate',
  defaults: {
    nodeDescription: '',
    nodeName: '',
    open: false,
    page: NODE_CREATION_PAGES.STARTER,
  },
})
export class NodeCreationState implements NgxsOnInit {
  private dialog: DialogRef | undefined;
  private titleStarter: string | undefined;

  constructor(
    private readonly containers: ContainerService,
    private readonly dialogService: DialogService,
    private readonly resources: Resources
  ) {}

  @Selector()
  static nodeDescription(state: StateModel): string {
    return state.nodeDescription;
  }

  @Selector()
  static nodeName(state: StateModel): string {
    return state.nodeName;
  }

  @Selector()
  static open(state: StateModel): boolean {
    return state.open;
  }

  @Selector()
  static page(state: StateModel): NODE_CREATION_PAGES_TYPE {
    return state.page;
  }

  @Selector()
  static parentTitle(state: StateModel): string {
    return state.parent?.title ?? '';
  }

  @Selector()
  static view(state: StateModel): PROJECT_VIEW_TYPE {
    return state.view!;
  }

  ngxsOnInit() {
    this.titleStarter = this.resources.get('Wbs.AddNode');
  }

  @Action(OpenNodeCreationDialog)
  open(ctx: StateContext<StateModel>, action: OpenNodeCreationDialog): void {
    ctx.patchState({
      open: true,
      parent: action.parent,
      page: NODE_CREATION_PAGES.STARTER,
    });
    this.dialog = this.dialogService.open({
      content: WbsCreateComponent,
      appendTo: this.containers.body,
      width: 800,
      height: 600,
    });
    this.setPage(ctx);

    this.dialog.result.subscribe((x: DialogCloseResult) => {
      if (x instanceof DialogCloseResult)
        ctx.dispatch(new CloseNodeCreationDialog());
      else {
        //
      }
    });
  }

  @Action(CloseNodeCreationDialog)
  close(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      open: false,
      parent: undefined,
    });
  }

  @Action(DialogViewSelected)
  dialogViewSelected(
    ctx: StateContext<StateModel>,
    action: DialogViewSelected
  ): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.NAME_DESCRIPTION,
    });
    this.setPage(ctx);
  }

  @Action(NameDescriptionPrevious)
  ndPrev(ctx: StateContext<StateModel>, action: NameDescriptionPrevious): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.STARTER,
    });
    this.setPage(ctx);
  }

  @Action(NameDescriptionNext)
  ndNext(ctx: StateContext<StateModel>, action: NameDescriptionNext): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.STARTER,
      nodeDescription: action.description,
      nodeName: action.name,
    });
    this.setPage(ctx);
  }

  private setPage(ctx: StateContext<StateModel>): void {
    const page = ctx.getState().page;
    const pageResource =
      page === NODE_CREATION_PAGES.STARTER
        ? 'Wbs.LetsGetStarted'
        : page === NODE_CREATION_PAGES.NAME_DESCRIPTION
        ? 'Wbs.NameAndDescription'
        : '';

    const pageTitle = this.resources.get(pageResource);

    this.dialog!.dialog.instance.title = `${this.titleStarter} - ${pageTitle}`;
  }
}
