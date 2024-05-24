import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Category, LISTS, Role, RoleIds, ROLES } from '@wbs/core/models';
import { Resources, sorter } from '@wbs/core/services';
import { Observable, forkJoin, map, of } from 'rxjs';
import { ROLE_ICONS } from 'src/environments/icons';

@Injectable({ providedIn: 'root' })
export class MetadataStore {
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);
  private loaded = false;

  readonly categories = new CategoryState(this.data);
  readonly roles = new RolesState(this.data, this.resources);

  loadAsync(): Observable<any> {
    if (this.loaded) return of('nothing');
    this.loaded = true;

    return forkJoin([this.categories.loadAsync(), this.roles.loadAsync()]).pipe(
      map(() => {})
    );
  }
}

class CategoryState {
  constructor(private readonly data: DataServiceFactory) {}

  private _icons = new Map<string, Map<string, string>>();
  private _list = new Map<string, Category[]>();
  private _names = new Map<string, Map<string, string>>();

  //
  //  ICONS
  //
  get icons(): Map<string, Map<string, string>> {
    return this._icons;
  }

  getIcons(category: string): Map<string, string> {
    return this._icons.get(category)!;
  }

  getIcon(category: string, key: string): string | undefined {
    return this._icons.get(category)?.get(key);
  }

  //
  //  NAMES
  //
  get names(): Map<string, Map<string, string>> {
    return this._names;
  }

  getNames(category: string): Map<string, string> {
    return this._names.get(category)!;
  }

  getName(category: string, key: string): string | undefined {
    return this._names.get(category)?.get(key);
  }

  //
  //  LISTS
  //

  get disciplines(): Category[] {
    return this._list.get(LISTS.DISCIPLINE)!;
  }

  get phases(): Category[] {
    return this._list.get(LISTS.PHASE)!;
  }

  get projectCategories(): Category[] {
    return this._list.get(LISTS.PROJECT_CATEGORIES)!;
  }

  loadAsync(): Observable<void> {
    return forkJoin([
      this.data.metdata.getListAsync<Category>(LISTS.PROJECT_CATEGORIES),
      this.data.metdata.getListAsync<Category>(LISTS.DISCIPLINE),
      this.data.metdata.getListAsync<Category>(LISTS.PHASE),
    ]).pipe(
      map(([projectCats, discipline, phase]) => {
        const categoryList = new Map<string, Category[]>();
        const categoryIcons = new Map<string, Map<string, string>>();
        const categoryNames = new Map<string, Map<string, string>>();

        discipline = discipline.sort((a, b) =>
          sorter(a.order ?? 0, b.order ?? 0)
        );
        phase = phase.sort((a, b) => sorter(a.order ?? 0, b.order ?? 0));
        projectCats = projectCats.sort((a, b) =>
          sorter(a.order ?? 0, b.order ?? 0)
        );

        categoryIcons.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryIcons.set(LISTS.PHASE, new Map<string, string>());
        categoryIcons.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryNames.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryNames.set(LISTS.PHASE, new Map<string, string>());
        categoryNames.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryList.set(LISTS.DISCIPLINE, discipline);
        categoryList.set(LISTS.PHASE, phase);
        categoryList.set(LISTS.PROJECT_CATEGORIES, projectCats);

        for (const cat of projectCats) {
          const type = LISTS.PROJECT_CATEGORIES;

          categoryNames.get(type)!.set(cat.id, cat.label);

          if (cat.icon) categoryIcons.get(type)!.set(cat.id, cat.icon);
        }

        for (const cat of discipline) {
          const type = LISTS.DISCIPLINE;

          categoryNames.get(type)!.set(cat.id, cat.label);

          if (cat.icon) categoryIcons.get(type)!.set(cat.id, cat.icon);
        }

        for (const cat of phase) {
          const type = LISTS.PHASE;

          categoryNames.get(type)!.set(cat.id, cat.label);

          if (cat.icon) categoryIcons.get(type)!.set(cat.id, cat.icon);
        }

        this._icons = categoryIcons;
        this._list = categoryList;
        this._names = categoryNames;
      })
    );
  }
}

class RolesState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  private _ids: RoleIds | undefined;
  private _definitions: Role[] = [];

  get ids(): RoleIds {
    return this._ids!;
  }

  get definitions(): Role[] {
    return this._definitions;
  }

  loadAsync(): Observable<void> {
    return this.data.metdata.getRolesAsync().pipe(
      map((definitions) => {
        const pm = definitions.find((x) => x.name === ROLES.PM)!;
        const approver = definitions.find((x) => x.name === ROLES.APPROVER)!;
        const sme = definitions.find((x) => x.name === ROLES.SME)!;
        const admin = definitions.find((x) => x.name === ROLES.ADMIN)!;

        admin.description = this.resources.get('General.Admin-Full');
        admin.abbreviation = this.resources.get('General.Admin');

        approver.description = this.resources.get('General.Approver');
        approver.abbreviation = this.resources.get('General.Approver');
        approver.icon = ROLE_ICONS.approver;

        pm.description = this.resources.get('General.PM-Full');
        pm.abbreviation = this.resources.get('General.PM');
        pm.icon = ROLE_ICONS.pm;

        sme.description = this.resources.get('General.SME-Full');
        sme.abbreviation = this.resources.get('General.SME');
        sme.icon = ROLE_ICONS.sme;

        this._ids = {
          admin: admin.id,
          pm: pm.id,
          approver: approver.id,
          sme: sme.id,
        };
        this._definitions = [pm, approver, sme, admin];
      })
    );
  }
}
