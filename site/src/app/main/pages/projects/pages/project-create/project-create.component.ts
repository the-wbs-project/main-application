import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header.component';
import { BasicsComponent } from './components/sub-pages/basics/basics.component';
import { CategoriesComponent } from './components/sub-pages/categories/categories.component';
import { DisciplinesComponent } from './components/sub-pages/disciplines/disciplines.component';
import { GettingStartedComponent } from './components/sub-pages/getting-started.component';
import { LibOrScratchComponent } from './components/sub-pages/lib-or-scratch/lib-or-scratch.component';
import { NodeViewComponent } from './components/sub-pages/node-view/node-view.component';
import { PhaseComponent } from './components/sub-pages/phases/phases.component';
import { RolesComponent } from './components/sub-pages/roles/roles.component';
import { ProjectCreationPage } from './models';
import { ProjectCreateState } from './states';

@Component({
  standalone: true,
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    BasicsComponent,
    CategoriesComponent,
    DisciplinesComponent,
    FillElementDirective,
    GettingStartedComponent,
    HeaderComponent,
    LibOrScratchComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NodeViewComponent,
    PhaseComponent,
    RolesComponent,
  ],
})
export class ProjectCreateComponent {
  @Select(ProjectCreateState.page) page$!: Observable<
    ProjectCreationPage | undefined
  >;
}
