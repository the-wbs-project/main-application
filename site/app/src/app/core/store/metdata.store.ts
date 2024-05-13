import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Category,
  ListItem,
  LISTS,
  Role,
  RoleIds,
  ROLES,
} from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { Observable, forkJoin, map } from 'rxjs';
import { ROLE_ICONS } from 'src/environments/icons';

@Injectable({ providedIn: 'root' })
export class MetadataStore {
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);

  readonly categories = new CategoryState(this.data, this.resources);
  readonly roles = new RolesState(this.data, this.resources);

  loadAsync(): Observable<void> {
    return forkJoin([this.categories.loadAsync(), this.roles.loadAsync()]).pipe(
      map(() => {})
    );
  }
}

class CategoryState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  private _icons = new Map<string, Map<string, string>>();
  private _list = new Map<string, ListItem[]>();
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
      this.data.metdata.getListAsync<ListItem>(LISTS.PROJECT_CATEGORIES),
      this.data.metdata.getListAsync<ListItem>(LISTS.DISCIPLINE),
      this.data.metdata.getListAsync<ListItem>(LISTS.PHASE),
    ]).pipe(
      map(([projectCats, discipline, phase]) => {
        const categoryList = new Map<string, ListItem[]>();
        const categoryIcons = new Map<string, Map<string, string>>();
        const categoryNames = new Map<string, Map<string, string>>();

        discipline = discipline.sort((a, b) => a.order - b.order);
        phase = phase.sort((a, b) => a.order - b.order);
        projectCats = projectCats.sort((a, b) => a.order - b.order);

        categoryIcons.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryIcons.set(LISTS.PHASE, new Map<string, string>());
        categoryIcons.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryNames.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryNames.set(LISTS.PHASE, new Map<string, string>());
        categoryNames.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryList.set(LISTS.DISCIPLINE, discipline);
        categoryList.set(LISTS.PHASE, phase);
        categoryList.set(LISTS.PROJECT_CATEGORIES, projectCats);

        for (const cat of categoryList.keys()) {
          for (const item of categoryList.get(cat)!) {
            item.label = this.resources.get(item.label);

            if (item.description) {
              item.description = this.resources.get(item.description);
            }
          }
        }

        for (const cat of [...projectCats, ...discipline, ...phase]) {
          categoryNames.get(cat.type)!.set(cat.id, cat.label);

          if (cat.icon) categoryIcons.get(cat.type)!.set(cat.id, cat.icon);
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