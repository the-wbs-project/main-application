import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  EntryCreationModel,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  Phase,
  ProjectCategory,
} from '@wbs/core/models';
import { EntryService, IdService, Resources } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { MetadataStore, UserStore } from '@wbs/store';

@Component({
  standalone: true,
  selector: 'wbs-save-section',
  templateUrl: './save-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
  styles: ['.row-header { max-width: 200px; }'],
})
export class SaveSectionComponent {
  readonly close = output<EntryCreationModel | undefined>();

  private readonly metadata = inject(MetadataStore);
  private readonly data = inject(EntryService);
  private readonly resources = inject(Resources);
  private readonly userId = inject(UserStore).userId;
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

    return !phase
      ? ''
      : typeof phase !== 'string'
      ? phase.label
      : this.metadata.categories.phases.find((x) => x.id === phase)!.label;
  });

  save(): void {
    this.saveState.set('saving');

    const phaseDefinitions = this.metadata.categories.phases;
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
      author: this.userId()!,
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

    this.data.createAsync(entry, version, [node]).subscribe(() => {
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
