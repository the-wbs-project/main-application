import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/shared/models';
import { ContainerService, SwitcherService } from '@wbs/shared/services';
import { AuthState, ProjectListState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements AfterContentInit {
  @Select(ProjectListState.list) projects$!: Observable<Project[]>;
  @Select(AuthState.isAdmin) isAdmin$!: Observable<boolean>;

  @ViewChild('body', { static: true, read: ViewContainerRef })
  body: ViewContainerRef | undefined;

  constructor(
    private readonly container: ContainerService,
    private readonly switcher: SwitcherService
  ) {}

  ngAfterContentInit() {
    this.container.register(this.body);
  }

  toggleSwitcherBody() {
    this.switcher.emitChange(false);
  }
}
