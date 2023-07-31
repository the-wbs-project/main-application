import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { ContainerService } from '@wbs/core/services';
import { AuthState, OrganizationState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './components';
import { MainContentDirective } from './directives/main-content.directive';
import { NavService, SwitcherService } from './services';

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    MainContentDirective,
    RouterModule,
    SidebarComponent,
  ],
  providers: [NavService],
})
export class MainComponent implements AfterContentInit {
  @Select(OrganizationState.projects) projects$!: Observable<Project[]>;
  @Select(AuthState.isAdmin) isAdmin$!: Observable<boolean>;

  @ViewChild('body', { static: true, read: ViewContainerRef })
  body: ViewContainerRef | undefined;

  private readonly switcher = new SwitcherService();

  constructor(private readonly container: ContainerService) {}

  ngAfterContentInit() {
    this.container.register(this.body);
  }

  toggleSwitcherBody() {
    this.switcher.emitChange(false);
  }
}
