import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { UiState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models';
import { SettingsState } from '../../states';

@Component({
  selector: 'wbs-settings-bread-crumbs',
  templateUrl: './settings-breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  readonly root = '/settings';
  @Select(UiState.path) path$!: Observable<string | undefined>;
  @Select(SettingsState.crumbs) crumbs$!: Observable<Breadcrumb[]>;
}
