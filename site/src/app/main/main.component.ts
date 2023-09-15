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
import { DrawerModule } from '@progress/kendo-angular-layout';
import { ContainerService } from '@wbs/core/services';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FillElementDirective } from './directives/fill-element.directive';
import { MainContentDirective } from './directives/main-content.directive';
import { DialogService } from './services';
import { AuthState, MembershipState, RolesState, UiState } from './states';

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    DrawerModule,
    FillElementDirective,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    RouterModule,
    SidebarComponent,
  ],
})
export class MainComponent implements AfterContentInit {
  @ViewChild('body', { static: true }) body!: ViewContainerRef;

  readonly isSidebarExpanded = toSignal(
    this.store.select(UiState.isSidebarExpanded)
  );
  readonly isAdmin = toSignal(this.store.select(RolesState.isAdmin));
  readonly org = toSignal(this.store.select(MembershipState.organization));
  readonly orgs = toSignal(this.store.select(MembershipState.list));
  readonly projects = toSignal(this.store.select(MembershipState.projects));

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
