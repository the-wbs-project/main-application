import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { UiState } from '@wbs/main/states';

@Component({
  standalone: true,
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterModule, TranslateModule],
})
export class PageHeaderComponent {
  readonly breadcrumbs = this.store.select(UiState.breadcrumbs);
  items: any[] = [];
  constructor(private readonly store: SignalStore) {}
}
