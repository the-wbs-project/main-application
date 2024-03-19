import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { Organization, User } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { first, skipWhile, tap } from 'rxjs/operators';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { MainContentDirective } from './directives/main-content.directive';
import { AiState, AuthState, MembershipState, UiState } from './states';

@Component({
  standalone: true,
  template: `@if (org(); as org) {
    <div class="d-flex flex-column vh-100">
      <wbs-header
        [claims]="claims()"
        [org]="org"
        [orgs]="orgs()"
        [user]="user()"
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
    } @else {
    <div class="w-100 text-center pd-t-200">
      <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
      <br />
      <br />
      <h1>{{ 'General.Loading' | translate }}...</h1>
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
    LoaderModule,
    MainContentDirective,
    ProfileEditorComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class MainComponent implements AfterContentInit, OnInit {
  private readonly store = inject(SignalStore);

  readonly org = input.required<string>();
  readonly roles = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly orgs = input.required<Organization[]>();

  readonly loading = signal<boolean>(true);
  readonly user = input.required<User>();
  readonly showProfileEditor = model(false);
  readonly isAiEnabled = this.store.select(AiState.isEnabled);
  readonly activeSection = this.store.select(UiState.activeSection);

  ngAfterContentInit() {
    const profile = this.store.selectSnapshot(AuthState.profile);

    if (!profile?.name || profile.name === profile.email) {
      this.showProfileEditor.set(true);
    }
  }

  ngOnInit(): void {
    this.store
      .selectAsync(MembershipState.organizations)
      .pipe(
        skipWhile((x) => x == undefined),
        first(),
        tap((orgs) => {
          this.loading.set(false);

          if (!this.org())
            this.store.dispatch(new Navigate(['/', orgs![0].name, 'library']));
        })
      )
      .subscribe();
  }
}
