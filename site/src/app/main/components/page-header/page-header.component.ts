import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { UiState } from '@wbs/main/states';

@Component({
  standalone: true,
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [NgFor, NgIf, RouterModule, TranslateModule],
})
export class PageHeaderComponent {
  readonly header = toSignal(this.store.select(UiState.header));

  constructor(private readonly store: Store) {}
}
