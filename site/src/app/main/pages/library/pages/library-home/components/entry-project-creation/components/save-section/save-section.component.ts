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
  ListItem,
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
  private savedData?: [LibraryEntry, LibraryEntryVersion, LibraryEntryNode[]];

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly owner = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly visibility = input.required<string>();
  readonly category = input.required<ListItem>();
  readonly phases = input.required<CategorySelection[]>();
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
  readonly phaseReview = computed(() =>
    this.phases()
      .filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );

  save(): void {
    this.saveState.set('saving');

    const phases: ProjectCategory[] = [];
    const disciplines: ProjectCategory[] = [];
    const phaseDefinitions = this.store.selectSnapshot(MetadataState.phases);

    for (const discipline of this.disciplines()) {
      if (!discipline.selected) continue;

      disciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              label: discipline.label,
              order: 0,
              type: 'custom',
              tags: [],
            }
          : discipline.id
      );
    }

    for (const phase of this.phases()) {
      if (!phase.selected) continue;

      phases.push(
        phase.isCustom
          ? {
              id: phase.id,
              label: phase.label,
              order: 0,
              type: 'custom',
              tags: [],
            }
          : phase.id
      );
    }
    const entry: LibraryEntry = {
      author: this.store.selectSnapshot(AuthState.userId)!,
      id: IdService.generate(),
      owner: this.owner(),
      type: 'project',
      visibility: this.visibility(),
    };
    const version: LibraryEntryVersion = {
      entryId: entry.id,
      version: 1,
      categories: [this.category().id],
      status: 'draft',
      lastModified: new Date(),
      title: this.templateTitle(),
      phases,
      disciplines,
    };
    const nodes: LibraryEntryNode[] = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const phaseId = typeof phase === 'string' ? phase : phase.id;
      const phaseLabel =
        typeof phase === 'string'
          ? phaseDefinitions.find((x) => x.id === phase)!.label
          : phase.label;

      nodes.push({
        id: phaseId,
        entryId: entry.id,
        entryVersion: 1,
        order: 1,
        lastModified: new Date(),
        title: phaseLabel,
      });
    }

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
            nodes,
            []
          )
        )
      )
      .subscribe(() => {
        this.saveState.set('saved');
        this.savedData = [entry, version, nodes];
      });
  }

  actionClicked(action: 'view' | 'upload' | 'close'): void {
    this.close.emit({
      action,
      entry: this.savedData![0],
      version: this.savedData![1],
      nodes: this.savedData![2],
    });
  }
}
