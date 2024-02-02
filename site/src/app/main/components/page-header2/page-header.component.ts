import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RoutedBreadcrumbItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterModule, TranslateModule],
})
export class PageHeaderComponent {
  readonly breadcrumbs = input.required<RoutedBreadcrumbItem[]>();
}
