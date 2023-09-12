import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ContainerService } from '@wbs/core/services';
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './components';
import { MainContentDirective } from './directives/main-content.directive';
import { NavService, SwitcherService } from './services';
import { toSignal } from '@angular/core/rxjs-interop';
import { MembershipState, RolesState, UiState } from './states';
import { DrawerModule } from '@progress/kendo-angular-layout';
import { FillElementDirective } from './directives/fill-element.directive';

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NavService],
  imports: [
    CommonModule,
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
  readonly isSidebarExpanded = toSignal(
    this.store.select(UiState.isSidebarExpanded)
  );
  readonly isAdmin = toSignal(this.store.select(RolesState.isAdmin));
  readonly org = toSignal(this.store.select(MembershipState.organization));
  readonly orgs = toSignal(this.store.select(MembershipState.list));
  readonly projects = toSignal(this.store.select(MembershipState.projects));
  expanded = true;

  @ViewChild('body', { static: true, read: ViewContainerRef })
  body: ViewContainerRef | undefined;

  private readonly switcher = new SwitcherService();

  constructor(
    private readonly container: ContainerService,
    private readonly store: Store
  ) {}

  ngAfterContentInit() {
    this.container.register(this.body);
  }

  toggleSwitcherBody() {
    this.switcher.emitChange(false);
  }
}
