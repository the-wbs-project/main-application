import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { Organization } from '@wbs/core/models';
import { ContainerService } from '@wbs/core/services';
import { first, skipWhile, tap } from 'rxjs/operators';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { MainContentDirective } from './directives/main-content.directive';
import { DialogService } from './services';
import { AiState, AuthState, MembershipState } from './states';

@Component({
  standalone: true,
  template: `@if (org) {
    <div class="d-flex flex-column vh-100">
      <wbs-header [claims]="claims" [org]="org" [orgs]="orgs" />
      <div #body appMainContent class="scroll pd-x-20 flex-fill">
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
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    ChatWindowComponent,
    FooterComponent,
    HeaderComponent,
    LoaderModule,
    MainContentDirective,
    RouterModule,
    TranslateModule,
  ],
})
export class MainComponent implements AfterContentInit, OnInit {
  @Input() owner?: string;
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) org!: Organization;
  @Input({ required: true }) orgs!: Organization[];
  @ViewChild('body', { static: true }) body!: ViewContainerRef;

  readonly loading = signal<boolean>(true);
  readonly isAiEnabled = toSignal(this.store.select(AiState.isEnabled));

  constructor(
    private readonly container: ContainerService,
    private readonly dialog: DialogService,
    private readonly store: Store
  ) {}

  ngAfterContentInit() {
    this.container.register(this.body);

    const profile = this.store.selectSnapshot(AuthState.profile);

    if (!profile?.name || profile.name === profile.email) {
      this.dialog
        .openDialog(ProfileEditorComponent, {
          size: 'md',
        })
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.store
      .select(MembershipState.organizations)
      .pipe(
        skipWhile((x) => x == undefined),
        first(),
        tap((orgs) => {
          this.loading.set(false);

          if (!this.owner)
            this.store.dispatch(new Navigate(['/', orgs![0].name, 'projects']));
        })
      )
      .subscribe();
  }
}
