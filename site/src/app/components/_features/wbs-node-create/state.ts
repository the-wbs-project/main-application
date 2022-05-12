import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import {
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/shared/models';
import { ContainerService, Resources } from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import {
  CloseNodeCreationDialog,
  DialogViewSelected,
  DisciplineNext,
  DisciplinePrevious,
  OpenNodeCreationDialog,
  OtherFlagsNext,
  OtherFlagsPrevious,
  PhaseNext,
  PhasePrevious,
  SaveNode,
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
  syncWithDisciplines: boolean;
  view?: PROJECT_NODE_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'nodeCreate',
  defaults: {
    disciplines: [],
    description: '',
    open: false,
    page: NODE_CREATION_PAGES.STARTER,
    syncWithDisciplines: false,
    title: '',
  },
})
export class NodeCreationState {
  private dialog: DialogRef | undefined;

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
  static syncWithDisciplines(state: StateModel): boolean {
    return state.syncWithDisciplines;
  }

  @Selector()
  static title(state: StateModel): string {
    return state.title;
  }

  @Selector()
  static view(state: StateModel): PROJECT_NODE_VIEW_TYPE {
    return state.view!;
  }

  @Action(OpenNodeCreationDialog)
  open(ctx: StateContext<StateModel>, action: OpenNodeCreationDialog): void {
    ctx.patchState({
      open: true,
      parent: action.parent,
      page: NODE_CREATION_PAGES.STARTER,
      view: action.view,
    });

    if (action.view === PROJECT_NODE_VIEW.DISCIPLINE) {
      ctx.patchState({
        phase: action.parent?.phaseId,
      });
    }
    this.dialog = this.dialogService.open({
      content: WbsCreateComponent,
      appendTo: this.containers.body,
      width: 600,
      height: 600,
    });
    this.setPage(ctx);

    this.dialog.result.subscribe((x: DialogCloseResult | 'save') => {
      if (x instanceof DialogCloseResult)
        ctx.dispatch(new CloseNodeCreationDialog());
      else if (x === 'save') {
        ctx.dispatch(new SaveNode());
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
      page:
        state.view === PROJECT_NODE_VIEW.DISCIPLINE
          ? NODE_CREATION_PAGES.PHASE
          : NODE_CREATION_PAGES.DISCIPLINES,
    });
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

    ctx.patchState({
      page:
        state.view === PROJECT_NODE_VIEW.DISCIPLINE
          ? NODE_CREATION_PAGES.PHASE
          : NODE_CREATION_PAGES.TITLE_DESCRIPTION,
    });
    this.setPage(ctx);
  }

  @Action(DisciplineNext)
  disciplineNext(ctx: StateContext<StateModel>, action: DisciplineNext): void {
    ctx.patchState({
      disciplines: action.disciplines,
      page: NODE_CREATION_PAGES.OTHER_FLAGS,
    });
    this.setPage(ctx);
  }

  @Action(OtherFlagsPrevious)
  otherFlagsPrevious(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: NODE_CREATION_PAGES.DISCIPLINES,
    });
    this.setPage(ctx);
  }

  @Action(OtherFlagsNext)
  otherFlagsNext(ctx: StateContext<StateModel>, action: OtherFlagsNext): void {
    ctx.patchState({
      syncWithDisciplines: action.flags['syncWithDisciplines'] ?? false,
    });
    if (this.dialog) this.dialog.close('save');
    this.setPage(ctx);
  }

  @Action(SaveNode)
  saveNode(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();
    const model: WbsNode = {
      id: '',
      parentId: state.parent!.id,
      description: state.description,
      disciplineIds: state.disciplines,
      title: state.title,
      order: -1,
      phase: {
        isDisciplineNode: false,
        syncWithDisciplines: state.syncWithDisciplines,
      },
      discipline: [],
    };

    for (const discipline of state.disciplines) {
      model.discipline!.push({
        disciplineId: discipline,
      });
    }
  }

  private setPage(ctx: StateContext<StateModel>): void {
    const page = ctx.getState().page;
    const pageResource =
      page === NODE_CREATION_PAGES.STARTER
        ? 'Wbs.LetsGetStarted'
        : page === NODE_CREATION_PAGES.TITLE_DESCRIPTION
        ? 'Wbs.NameAndDescription'
        : page === NODE_CREATION_PAGES.PHASE
        ? 'Wbs.SelectPhase'
        : page === NODE_CREATION_PAGES.DISCIPLINES
        ? 'Wbs.SelectDisciplines'
        : page === NODE_CREATION_PAGES.OTHER_FLAGS
        ? 'Wbs.OtherFlags'
        : '';

    const part1 = this.resources.get('Wbs.CreateTask');
    const part2 = this.resources.get(pageResource);

    this.dialog!.dialog.instance.title = `${part1} - ${part2}`;
  }
}
