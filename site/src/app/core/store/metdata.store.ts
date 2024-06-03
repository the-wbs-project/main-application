import { inject, Injectable } from '@angular/core';
import { Category, LISTS, Role, RoleIds, ROLES } from '@wbs/core/models';
import { Resources, sorter } from '@wbs/core/services';
import { ROLE_ICONS } from 'src/environments/icons';

@Injectable({ providedIn: 'root' })
export class MetadataStore {
  private readonly resources = inject(Resources);

  readonly categories = new CategoryState();
  readonly roles = new RolesState(this.resources);
}

class CategoryState {
  constructor() {
    console.log('hello');
    console.log('hello');
    console.log('hello');
    this.initiate();
  }

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

  private initiate(): void {
    //@ts-ignore
    const config = window.appConfig;
    let projectCats: Category[] = config.project_categories;
    let discipline: Category[] = config.disciplines;
    let phase: Category[] = config.phases;

    console.log(projectCats.map((x) => x.label).sort((a, b) => sorter(a, b)));
    console.log(discipline.map((x) => x.label).sort((a, b) => sorter(a, b)));

    const categoryList = new Map<string, Category[]>();
    const categoryIcons = new Map<string, Map<string, string>>();
    const categoryNames = new Map<string, Map<string, string>>();

    discipline = discipline.sort((a, b) => sorter(a.order ?? 0, b.order ?? 0));
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
  }
}

class RolesState {
  constructor(private readonly resources: Resources) {
    this.initiate();
  }

  private _ids: RoleIds | undefined;
  private _definitions: Role[] = [];

  get ids(): RoleIds {
    return this._ids!;
  }

  get definitions(): Role[] {
    return this._definitions;
  }

  private initiate(): void {
    //@ts-ignore
    const definitions: Role[] = window.appConfig.roles;

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
  }
}
