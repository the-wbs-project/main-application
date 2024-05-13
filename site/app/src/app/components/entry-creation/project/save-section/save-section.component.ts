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
  Category,
  EntryCreationModel,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { IdService, Resources } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { UserStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-save-section',
  templateUrl: './save-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
  providers: [EntryService],
  styles: ['.row-header { max-width: 200px; }'],
})
export class SaveSectionComponent {
  readonly close = output<EntryCreationModel | undefined>();

  private readonly data = inject(EntryService);
  private readonly resources = inject(Resources);
  private readonly userId = inject(UserStore).userId;
  private savedData?: [LibraryEntry, LibraryEntryVersion, LibraryEntryNode[]];

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly owner = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly visibility = input.required<string>();
  readonly category = input.required<Category>();
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
  readonly phaseCount = computed(
    () => this.phases().filter((x) => x.selected).length
  );
  readonly phaseReview = computed(() =>
    this.phases()
      .filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );

  save(): void {
    this.saveState.set('saving');

    const phases = this.phases().filter((x) => x.selected);
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
      author: this.userId()!,
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
      disciplines,
    };
    const nodes: LibraryEntryNode[] = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];

      nodes.push({
        id: IdService.generate(),
        phaseIdAssociation: phase.id,
        order: i + 1,
        lastModified: new Date(),
        title: phase.label,
        description: phase.description,
      });
    }

    this.data.createAsync(entry, version, nodes).subscribe(() => {
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
