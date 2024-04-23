import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ChatWindowComponent } from '@wbs/components/chat-window';
import { Organization } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { UserStore } from '@wbs/store';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header';
import { ProfileEditorComponent } from './components/profile-editor';
import { MainContentDirective } from '../core/directives/main-content.directive';
import { AiState, UiState } from '../main/states';

@Component({
  standalone: true,
  template: `@if (org(); as org) {
    <div class="d-flex flex-column vh-100">
      <wbs-header
        [claims]="claims()"
        [org]="org"
        [orgs]="orgs()"
        [user]="user()!"
        [roles]="roles()"
        [activeSection]="activeSection()"
      />
      <div appMainContent class="scroll pd-x-20 flex-fill">
        <router-outlet />
      </div>
      <wbs-footer />
      <div class="pos-absolute b-40 r-0">
        @if (isAiEnabled()) {
        <wbs-chat-window />
        }
      </div>
    </div>
    }
    <div kendoDialogContainer></div>
    <wbs-profile-editor [(show)]="showProfileEditor" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChatWindowComponent,
    DialogModule,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    ProfileEditorComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class LayoutComponent implements AfterContentInit {
  private readonly store = inject(SignalStore);
  private readonly userStore = inject(UserStore);

  readonly org = input.required<string>();
  readonly roles = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly orgs = input.required<Organization[]>();

  readonly user = inject(UserStore).profile;
  readonly showProfileEditor = model(false);
  readonly isAiEnabled = this.store.select(AiState.isEnabled);
  readonly activeSection = this.store.select(UiState.activeSection);

  ngAfterContentInit() {
    const profile = this.userStore.profile();
    //
    //  only if org is set
    //
    if (this.org() && (!profile?.name || profile.name === profile.email)) {
      this.showProfileEditor.set(true);
    }
  }
}
