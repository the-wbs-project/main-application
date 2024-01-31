import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { SignalStore } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';
import { LibraryCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './phases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseEditorComponent, WizardFooterComponent],
  providers: [CategorySelectionService],
})
export class PhaseComponent implements OnInit {
  readonly org = input.required<string>();
  readonly type = input.required<string>();
  readonly categories = signal<CategorySelection[] | undefined>(undefined);

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly service: LibraryEntryCreateService,
    private readonly store: SignalStore
  ) {}

  ngOnInit(): void {
    this.categories.set(
      this.catService.build(
        this.store.selectSnapshot(MetadataState.phases),
        this.store.selectSnapshot(LibraryCreateState.phases)
      )
    );
  }

  back(): void {
    this.service.nav(this.org(), LIBRARY_ENTRY_CREATION_PAGES.CATEGORIES);
  }

  continue(): void {
    const phases = this.catService.extractIds(this.categories());

    this.service.setPhases(this.org(), phases);
  }

  nonSelected(categories: CategorySelection[]): boolean {
    return categories.every((c) => !c.selected);
  }
}
