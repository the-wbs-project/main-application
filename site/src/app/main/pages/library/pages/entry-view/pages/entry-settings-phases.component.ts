import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService, WbsNodeService } from '@wbs/main/services';
import { EntryService, EntryState, EntryTaskService } from '../services';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Phases' | translate }}
    </div>
    <div class="pd-15">
      <wbs-phase-editor
        [(categories)]="phases"
        [showSave]="true"
        (saveClicked)="save()"
      />
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseEditorComponent, TranslateModule],
  providers: [CategorySelectionService, EntryService, WbsNodeService],
})
export class PhasesComponent implements DirtyComponent, OnInit {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryTaskService);
  private readonly state = inject(EntryState);
  private readonly wbsService = inject(WbsNodeService);

  readonly phases = model<CategorySelection[]>([]);
  readonly isDirty = () => this.catService.isListDirty(this.phases());

  ngOnInit(): void {
    this.set();
  }

  save(): void {
    this.service
      .savePhaseChangesAsync(this.phases())
      .subscribe(() => this.set());
  }

  private set(): void {
    this.phases.set(
      this.wbsService.getPhasesForEdit(
        this.state.viewModels()!,
        'Projects.PhaseRemoveConfirm'
      )
    );
  }
}
