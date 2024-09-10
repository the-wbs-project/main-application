import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MainContentDirective } from '@wbs/core/directives/main-content.directive';
import { MembershipStore, UiStore, UserStore } from '@wbs/core/store';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header';

@Component({
  standalone: true,
  template: `@if (org(); as org) {
    <div class="d-flex flex-column vh-100">
      <wbs-header
        [claims]="claims()"
        [org]="org"
        [orgs]="membershipStore.memberships()!"
        [user]="user()!"
        [roles]="membershipStore.roles()!"
        [activeSection]="activeSection()"
      />
      <div appMainContent class="scroll pd-x-20 flex-fill">
        <router-outlet />
      </div>
      <wbs-footer />
    </div>
    }
    <div kendoDialogContainer></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    RouterModule,
  ],
})
export class LayoutComponent {
  readonly org = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly membershipStore = inject(MembershipStore);

  readonly user = inject(UserStore).profile;
  readonly activeSection = inject(UiStore).activeSection;
}
