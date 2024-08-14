import { inject, Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  Phase,
  ProjectCategory,
} from '@wbs/core/models';
import { IdService, SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class EntryCreationService {
  private readonly metadata = inject(MetadataStore);
  private readonly owner = inject(MembershipStore).membership;
  private readonly userId = inject(UserStore).userId;
  private readonly entryService = inject(EntryService);
  private readonly store = inject(Store);

  readonly saveState = new SaveService();

  createProjectEntryAsync(
    templateTitle: string,
    versionAlias: string,
    visibility: string,
    categoryId: string,
    phases: CategorySelection[],
    disciplines: CategorySelection[]
  ): Observable<void> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.name;

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
      .call(this.entryService.createAsync(entry, version, nodes), 0, 0)
      .pipe(
        tap(() =>
          this.store.dispatch(
            new Navigate(['/', owner, 'library', 'view', owner, entry.id, 1])
          )
        )
      );
  }

  createPhaseEntryAsync(
    templateTitle: string,
    versionAlias: string,
    visibility: string,
    phase: string | Phase,
    disciplines: CategorySelection[]
  ): Observable<void> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.name;
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
      .call(this.entryService.createAsync(entry, version, [node]), 0, 0)
      .pipe(
        tap(() =>
          this.store.dispatch(
            new Navigate(['/', owner, 'library', 'view', owner, entry.id, 1])
          )
        )
      );
  }

  createTaskEntryAsync(
    templateTitle: string,
    mainTaskTitle: string,
    versionAlias: string,
    visibility: string,
    disciplines: CategorySelection[]
  ): Observable<void> {
    const entryDisciplines: ProjectCategory[] = [];
    const owner = this.owner()!.name;

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
      .call(this.entryService.createAsync(entry, version, [node]), 0, 0)
      .pipe(
        tap(() =>
          this.store.dispatch(
            new Navigate(['/', owner, 'library', 'view', owner, entry.id, 1])
          )
        )
      );
  }
}
