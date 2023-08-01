import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAlignLeft, faX } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { UiState } from '@wbs/core/states';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, FontAwesomeModule, RouterModule, TranslateModule],
})
export class HeaderComponent {
  private readonly store = inject(Store);

  readonly info = toSignal(this.store.select(UiState.header));

  readonly faAlignLeft = faAlignLeft;
  readonly faX = faX;
  isCollapsed = true;
}
