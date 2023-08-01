import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Select } from '@ngxs/store';
import { UiState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models';
import { SettingsState } from '../../states';

@Component({
  standalone: true,
  selector: 'wbs-settings-bread-crumbs',
  templateUrl: './settings-breadcrumbs.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class BreadcrumbsComponent {
  readonly root = '/settings';
  @Select(UiState.path) path$!: Observable<string | undefined>;
  @Select(SettingsState.crumbs) crumbs$!: Observable<Breadcrumb[]>;
}
