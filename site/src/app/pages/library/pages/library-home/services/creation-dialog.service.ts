import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  Phase,
  ProjectCategory,
} from '@wbs/core/models';
import {
  CategoryService,
  IdService,
  NavigationService,
  SaveService,
} from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { EntryActivityService } from '@wbs/pages/library/services';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class CreationDialogService {
  private readonly activity = inject(EntryActivityService);
  private readonly catService = inject(CategoryService);
  private readonly data = inject(DataServiceFactory);
  private readonly metadata = inject(MetadataStore);
  private readonly navigate = inject(NavigationService);
  private readonly owner = inject(MembershipStore).membership;
  private readonly userId = inject(UserStore).userId;

  readonly saveState = new SaveService();

  createDisciplines(): CategorySelection[] {
    return this.catService.buildDisciplines([]);
  }

  createPhases(): CategorySelection[] {
    return this.catService.buildPhases([]);
  }

  createProjectEntryAsync(
    templateTitle: string,
    versionAlias: string,
    visibility: string,
    categoryId: string,
    phases: CategorySelection[],
    disciplines: CategorySelection[]
  ): Observable<unknown> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.id;

    for (const discipline of disciplines) {
      if (!discipline.selected) continue;

      entryDisciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              isCustom: true,
              label: discipline.label,
            }
          : { id: discipline.id, isCustom: false }
      );
    }
    const entry: LibraryEntry = {
      id: IdService.generate(),
      recordId: '',
      ownerId: owner,
      type: 'project',
      visibility,
    };
    const version: LibraryEntryVersion = {
      entryId: entry.id,
      version: 1,
      categories: [categoryId],
      status: 'draft',
      versionAlias,
      lastModified: new Date(),
      title: templateTitle,
      disciplines,
      author: this.userId()!,
      editors: [],
    };
    const nodes: LibraryEntryNode[] = [];

    phases = phases.filter((x) => x.selected);

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

    return this.saveState
      .call(this.createAsync(entry, version, nodes), 0, 0)
      .pipe(switchMap((newEntry) => this.go(owner, newEntry)));
  }

  createPhaseEntryAsync(
    templateTitle: string,
    versionAlias: string,
    visibility: string,
    phase: string | Phase,
    disciplines: CategorySelection[]
  ): Observable<unknown> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.id;
    const phaseDefinitions = this.metadata.categories.phases;
    let phaseId: string | undefined;
    let phaseLabel: string | undefined;
    let phaseDescription: string | undefined;

    if (typeof phase === 'string') {
      const phaseDef = phaseDefinitions.find((x) => x.id === phase)!;
      phaseId = phaseDef.id;
      phaseLabel = phaseDef.label;
      phaseDescription = phaseDef.description;
    } else {
      phaseLabel = phase.label;
      phaseDescription = phase.description;
    }

    for (const discipline of disciplines) {
      if (!discipline.selected) continue;

      entryDisciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              isCustom: true,
              label: discipline.label,
            }
          : { id: discipline.id, isCustom: false }
      );
    }
    const entry: LibraryEntry = {
      id: IdService.generate(),
      recordId: '',
      ownerId: owner,
      type: 'phase',
      visibility,
    };
    const version: LibraryEntryVersion = {
      entryId: entry.id,
      version: 1,
      categories: [],
      status: 'draft',
      versionAlias,
      lastModified: new Date(),
      title: templateTitle,
      disciplines,
      author: this.userId()!,
      editors: [],
    };
    const node: LibraryEntryNode = {
      id: IdService.generate(),
      order: 1,
      lastModified: new Date(),
      title: phaseLabel,
      description: phaseDescription,
      phaseIdAssociation: phaseId,
    };

    return this.saveState
      .call(this.createAsync(entry, version, [node]), 0, 0)
      .pipe(switchMap((newEntry) => this.go(owner, newEntry)));
  }

  createTaskEntryAsync(
    templateTitle: string,
    mainTaskTitle: string,
    versionAlias: string,
    visibility: string,
    disciplines: CategorySelection[]
  ): Observable<unknown> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.id;

    for (const discipline of disciplines) {
      if (!discipline.selected) continue;

      entryDisciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              isCustom: true,
              label: discipline.label,
            }
          : { id: discipline.id, isCustom: false }
      );
    }
    const entry: LibraryEntry = {
      id: IdService.generate(),
      recordId: '',
      ownerId: owner,
      type: 'task',
      visibility,
    };
    const version: LibraryEntryVersion = {
      entryId: entry.id,
      version: 1,
      categories: [],
      status: 'draft',
      versionAlias,
      lastModified: new Date(),
      title: templateTitle,
      disciplines,
      author: this.userId()!,
      editors: [],
    };
    const node: LibraryEntryNode = {
      id: IdService.generate(),
      order: 1,
      lastModified: new Date(),
      title: mainTaskTitle,
    };

    return this.saveState
      .call(this.createAsync(entry, version, [node]), 0, 0)
      .pipe(switchMap((newEntry) => this.go(owner, newEntry)));
  }

  private createAsync(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[]
  ): Observable<LibraryEntry> {
    return this.data.libraryEntries.putEntryAsync(entry).pipe(
      switchMap((newEntry) =>
        this.data.libraryEntries.putVersionAsync(entry.ownerId, version).pipe(
          switchMap(() =>
            this.data.libraryEntries.putTasksAsync(
              entry.ownerId,
              entry.id,
              version.version,
              tasks,
              []
            )
          ),
          tap(() =>
            this.activity.entryCreated(
              entry.ownerId,
              entry.id,
              entry.type,
              version.title
            )
          ),
          map(() => newEntry)
        )
      )
    );
  }

  private go(owner: string, entry: LibraryEntry): Observable<boolean> {
    return this.data.libraryEntries
      .getRecordIdAsync(owner, entry.id)
      .pipe(
        switchMap((recordId) =>
          this.navigate.toLibraryEntry(owner, recordId, 1)
        )
      );
  }
}
