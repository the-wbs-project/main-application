import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntryNode } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { PhaseSelectionComponent } from '../../../components/phase-section';
import { EntryService, EntryState, EntryTaskService } from '../services';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Phase' | translate }}
    </div>
    <div class="pd-15">
      <wbs-phase-selection [(phase)]="phase" />
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseSelectionComponent, TranslateModule],
  providers: [CategorySelectionService, EntryService],
})
export class PhaseComponent implements DirtyComponent, OnInit {
  private readonly service = inject(EntryTaskService);
  private readonly store = inject(SignalStore);
  readonly state = inject(EntryState);

  readonly cats = this.store.select(MetadataState.phases);
  readonly current = computed(() => this.getPhase(this.state.tasks() ?? []));
  readonly phase = model<string | { label: string } | undefined>();
  readonly isDirty = computed(() => this.current() != this.phase());

  ngOnInit(): void {
    this.phase.set(this.current());
  }

  save(): void {
    // this.service
    //   .savePhaseChangesAsync(this.phases())
    //   .subscribe(() => this.set());
  }

  private getPhase(
    tasks: LibraryEntryNode[]
  ): string | { label: string } | undefined {
    const phase = tasks.find((x) => x.parentId == undefined);

    return phase?.phaseIdAssociation ?? { label: phase?.title ?? '' };
  }
}
