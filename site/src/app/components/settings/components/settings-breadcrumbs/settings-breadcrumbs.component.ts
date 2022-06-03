import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { UiState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings-bread-crumbs',
  templateUrl: './settings-breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  readonly root = '/settings';
  @Select(UiState.path) path$!: Observable<string | undefined>;
}
