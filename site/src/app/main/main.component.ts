import { NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ContainerService } from '@wbs/core/services';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { FillElementDirective } from './directives/fill-element.directive';
import { MainContentDirective } from './directives/main-content.directive';
import { DialogService } from './services';
import { AiState, AuthState } from './states';

@Component({
  standalone: true,
  template: `<div class="d-flex flex-column vh-100">
    <wbs-header />
    <div #body appMainContent appFillElement class="scroll pd-x-20">
      <router-outlet />
    </div>
    <wbs-footer />
    <div class="pos-absolute b-40 r-0">
      <wbs-chat-window *ngIf="isAiEnabled()" />
    </div>
  </div> `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    ChatWindowComponent,
    FillElementDirective,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    NgIf,
    RouterModule,
  ],
})
export class MainComponent implements AfterContentInit {
  @ViewChild('body', { static: true }) body!: ViewContainerRef;

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
}
