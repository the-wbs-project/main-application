import { inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Selector, State, StateContext, Store } from '@ngxs/store';
import { ProjectState } from '../../../states';
import { CHECKLIST_RESULTS, ChecklistItemResults } from '../models';
import { ProjectChecklistService } from '../services';

interface StateModel {
  canSubmitForApproval: boolean;
  checklist?: ChecklistItemResults[];
}

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'projectChecklist',
  defaults: {
    canSubmitForApproval: false,
  },
})
export class ProjectChecklistState {
  private readonly service = inject(ProjectChecklistService);
  private readonly store = inject(Store);

  @Selector()
  static canSubmitForApproval(state: StateModel): boolean {
    return state.canSubmitForApproval;
  }

  @Selector()
  static checklist(state: StateModel): ChecklistItemResults[] | undefined {
    return state.checklist;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.setup(ctx));

    this.store
      .select(ProjectState.nodes)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.setup(ctx));

    this.setup(ctx);
  }

  private setup(ctx: StateContext<StateModel>): void {
    const project = this.store.selectSnapshot(ProjectState.current);
    const tasks = this.store.selectSnapshot(ProjectState.nodes) ?? [];

    if (!project) return;

    const checklist = this.service.calculate(project, tasks);

    ctx.patchState({
      checklist,
      canSubmitForApproval: !checklist.some(
        (x) => x.result === CHECKLIST_RESULTS.FAIL
      ),
    });
  }
}
