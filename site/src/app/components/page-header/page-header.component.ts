import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterModule, TranslateModule],
})
export class PageHeaderComponent {
  readonly breadcrumbs = inject(UiStore).breadcrumbs;
}
