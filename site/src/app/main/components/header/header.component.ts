import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { menuIcon } from '@progress/kendo-svg-icons';
import { ToggleSidebar } from '@wbs/main/actions';
import { UiState } from '@wbs/main/states';
import { HeaderProfileComponent } from './header-profile/header-profile.component';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ButtonModule, HeaderProfileComponent, NgIf, TranslateModule],
})
export class HeaderComponent {
  readonly isExpanded = toSignal(this.store.select(UiState.isSidebarExpanded));
  readonly info = toSignal(this.store.select(UiState.header));
  readonly menuIcon = menuIcon;

  constructor(private readonly store: Store) {}

  toggleSidebar() {
    this.store.dispatch(new ToggleSidebar());
  }
}
