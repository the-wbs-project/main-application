import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { ProjectState } from '../../states';
import { ProjectUploadState } from './states';
@Component({
  template: ` <app-page-header
      *ngIf="project$ | async; let project"
      [title]="(pageTitle$ | async) ?? '' | translate"
      [items]="[
        { route: ['/projects', 'list', 'my'], label: 'General.Projects' },
        { route: ['/projects', project.id, 'view'], label: project.title }
      ]"
      [active_item]="'General.Upload' | translate"
    ></app-page-header>

    <div class="mg-t-40">
      <router-outlet></router-outlet>
    </div>`,
})
export class ProjectUploadLayoutComponent {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectUploadState.pageTitle) pageTitle$!: Observable<string>;
}
