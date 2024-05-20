import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-settings-bread-crumbs',
  templateUrl: './settings-breadcrumbs.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class BreadcrumbsComponent {
  readonly uiStore = inject(UiStore);
  readonly root = '/settings';
}
