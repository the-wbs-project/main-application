import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { ContainerService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './components';
import { MainContentDirective } from './directives/main-content.directive';
import { NavService, SwitcherService } from './services';
import { iIsAdminPipe } from './pipes/is-admin.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { MembershipState, ProjectListState } from './states';

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    iIsAdminPipe,
    RouterModule,
    SidebarComponent,
  ],
  providers: [NavService],
})
export class MainComponent implements AfterContentInit {
  readonly membershipRoles = toSignal(this.store.select(MembershipState.rolesIds));
  readonly projects = toSignal(this.store.select(ProjectListState.all));

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
