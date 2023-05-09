import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { faAlignLeft, faX } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { UiState } from '@wbs/core/states';

@Component({
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly store = inject(Store);

  readonly info = toSignal(this.store.select(UiState.header));

  readonly faAlignLeft = faAlignLeft;
  readonly faX = faX;
  isCollapsed = true;
}
