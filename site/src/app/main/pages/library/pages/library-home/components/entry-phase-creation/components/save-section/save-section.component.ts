import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  Phase,
  ProjectCategory,
} from '@wbs/core/models';
import { IdService, Resources } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseLabelPipe } from '@wbs/main/pipes/phase-label.pipe';
import { AuthState, MetadataState } from '@wbs/main/states';
import { switchMap } from 'rxjs/operators';
import { EntryCreationModel } from '../../../../models';

@Component({
  standalone: true,
  selector: 'wbs-save-section',
  templateUrl: './save-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PhaseLabelPipe, TranslateModule],
  styles: ['.row-header { max-width: 200px; }'],
})
export class SaveSectionComponent {
  @Output() readonly close = new EventEmitter<EntryCreationModel | undefined>();

  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);
  private savedData?: [LibraryEntry, LibraryEntryVersion, LibraryEntryNode];

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly owner = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly visibility = input.required<string>();
  readonly phase = input.required<string | Phase>();
  readonly disciplines = input.required<CategorySelection[]>();
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  readonly visibilityReview = computed(() => {
    return this.resources.get(
      this.visibility() === 'private' ? 'General.Private' : 'General.Public'
    );
  });
  readonly disciplineReview = computed(() => {
    const list = this.disciplines();

    return list.length === 0
      ? this.resources.get('General.None')
      : list
          .filter((x) => x.selected)
          .map((x) => x.label)
          .join(', ');
  });
  readonly phaseLabel = computed(() => {
    const phase = this.phase();

    return typeof phase !== 'string'
      ? phase.label
      : this.resources.get(
          this.store
            .selectSnapshot(MetadataState.phases)
            .find((x) => x.id === phase)!.label
        );
  });

  save(): void {
    this.saveState.set('saving');

    const phaseDefinitions = this.store.selectSnapshot(MetadataState.phases);
    const phase = this.phase()!;
    let phaseId: string | undefined;
    let phaseLabel: string | undefined;
    let phaseDescription: string | undefined;

    if (typeof phase === 'string') {
      const phaseDef = phaseDefinitions.find((x) => x.id === phase)!;
      phaseId = phaseDef.id;
      phaseLabel = this.resources.get(phaseDef.label);
      phaseDescription = phaseDef.description
        ? this.resources.get(phaseDef.description)
        : undefined;
    } else {
      phaseLabel = phase.label;
      phaseDescription = phase.description;
    }

    const disciplines: ProjectCategory[] = [];

    for (const discipline of this.disciplines()) {
      if (!discipline.selected) continue;

      disciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              label: discipline.label,
            }
          : discipline.id
      );
    }
    const entry: LibraryEntry = {
      id: IdService.generate(),
      author: this.store.selectSnapshot(AuthState.userId)!,
      owner: this.owner(),
      type: 'phase',
      visibility: this.visibility(),
    };
    const version: LibraryEntryVersion = {
      entryId: entry.id,
      version: 1,
      categories: [],
      status: 'draft',
      lastModified: new Date(),
      title: this.templateTitle(),
      disciplines,
    };
    const node: LibraryEntryNode = {
      id: IdService.generate(),
      order: 1,
      lastModified: new Date(),
      title: phaseLabel,
      description: phaseDescription,
      phaseIdAssociation: phaseId,
    };

    this.data.libraryEntries
      .putAsync(entry)
      .pipe(
        switchMap(() =>
          this.data.libraryEntryVersions.putAsync(entry.owner, version)
        ),
        switchMap(() =>
          this.data.libraryEntryNodes.putAsync(
            entry.owner,
            entry.id,
            version.version,
            [node],
            []
          )
        )
      )
      .subscribe(() => {
        this.saveState.set('saved');
        this.savedData = [entry, version, node];
      });
  }

  actionClicked(action: 'view' | 'upload' | 'close'): void {
    this.close.emit({
      action,
      entry: this.savedData![0],
      version: this.savedData![1],
      nodes: [this.savedData![2]],
    });
  }
}
