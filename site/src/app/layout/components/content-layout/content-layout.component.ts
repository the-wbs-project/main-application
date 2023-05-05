import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { ContainerService } from '@wbs/core/services';
import { AuthState, OrganizationState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { SwitcherService } from '../../services';

@Component({
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements AfterContentInit {
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
