import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { PROJECT_VIEW, PROJECT_VIEW_TYPE, WbsNodeView } from '@wbs/models';
import { ContainerService, Resources } from '@wbs/services';
import {
  CloseNodeCreationDialog,
  DialogViewSelected,
  DisciplineNext,
  DisciplinePrevious,
  OpenNodeCreationDialog,
  PhaseNext,
  PhasePrevious,
  TitleDescriptionNext,
  TitleDescriptionPrevious,
} from './actions';
import { WbsCreateComponent } from './components';
import { NODE_CREATION_PAGES, NODE_CREATION_PAGES_TYPE } from './models';

interface StateModel {
  description: string;
  disciplines: string[];
  open: boolean;
  page: NODE_CREATION_PAGES_TYPE;
  parent?: WbsNodeView;
  phase?: string;
  title: string;
  view?: PROJECT_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'nodeCreate',
  defaults: {
    disciplines: [],
    description: '',
    open: false,
    page: NODE_CREATION_PAGES.STARTER,
    title: '',
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
  static description(state: StateModel): string {
    return state.description;
  }

  @Selector()
  static disciplines(state: StateModel): string[] {
    return state.disciplines;
  }

  @Selector()
  static open(state: StateModel): boolean {
    return state.open;
  }

  @Selector()
  static phase(state: StateModel): string | undefined {
    return state.phase;
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
  static parent(state: StateModel): WbsNodeView {
    return state.parent!;
  }

  @Selector()
  static title(state: StateModel): string {
    return state.title;
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

    this.dialog.result.subscribe((x: DialogCloseResult | 'save') => {
      if (x instanceof DialogCloseResult)
        ctx.dispatch(new CloseNodeCreationDialog());
      else if (x === 'save') {
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
      page: NODE_CREATION_PAGES.TITLE_DESCRIPTION,
    });
    this.setPage(ctx);
  }

  @Action(TitleDescriptionPrevious)
  tdPrev(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.STARTER,
    });
    this.setPage(ctx);
  }

  @Action(TitleDescriptionNext)
  tdNext(ctx: StateContext<StateModel>, action: TitleDescriptionNext): void {
    const state = ctx.getState();

    ctx.patchState({
      description: action.description,
      title: action.title,
    });

    if (state.view === PROJECT_VIEW.DISCIPLINE) {
      ctx.patchState({
        page: NODE_CREATION_PAGES.PHASE,
      });
    } else {
      ctx.patchState({
        page: NODE_CREATION_PAGES.DISCIPLINES,
        phase: state.parent?.phaseId,
      });
    }
    this.setPage(ctx);
  }

  @Action(PhasePrevious)
  phasePrevious(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.TITLE_DESCRIPTION,
    });
    this.setPage(ctx);
  }

  @Action(PhaseNext)
  phaseNext(ctx: StateContext<StateModel>, action: PhaseNext): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.DISCIPLINES,
      phase: action.phase,
    });
    this.setPage(ctx);
  }

  @Action(DisciplinePrevious)
  disciplinePrevious(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();

    if (state.view === PROJECT_VIEW.DISCIPLINE) {
      ctx.patchState({
        page: NODE_CREATION_PAGES.PHASE,
      });
    } else {
      ctx.patchState({
        page: NODE_CREATION_PAGES.TITLE_DESCRIPTION,
      });
    }
    this.setPage(ctx);
  }

  @Action(DisciplineNext)
  disciplineNext(ctx: StateContext<StateModel>, action: DisciplineNext): void {
    ctx.patchState({
      disciplines: action.disciplines,
      page: NODE_CREATION_PAGES.TAGS,
    });

    if (this.dialog) this.dialog.close();
    this.setPage(ctx);
  }

  private setPage(ctx: StateContext<StateModel>): void {
    const page = ctx.getState().page;
    const pageResource =
      page === NODE_CREATION_PAGES.STARTER
        ? 'Wbs.LetsGetStarted'
        : page === NODE_CREATION_PAGES.TITLE_DESCRIPTION
        ? 'Wbs.TitleAndDescription'
        : page === NODE_CREATION_PAGES.PHASE
        ? 'Wbs.SelectPhase'
        : page === NODE_CREATION_PAGES.DISCIPLINES
        ? 'Wbs.SelectDisciplines'
        : '';

    const pageTitle = this.resources.get(pageResource);

    this.dialog!.dialog.instance.title = `${this.titleStarter} - ${pageTitle}`;
  }
}
