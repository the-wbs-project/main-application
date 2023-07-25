import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProjectCreationPage } from './models';
import { ProjectCreateState } from './states';
import { CommonModule } from '@angular/common';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { BasicsComponent } from './components/sub-pages/basics/basics.component';
import { GettingStartedComponent } from './components/sub-pages/getting-started.component';
import { LibOrScratchComponent } from './components/sub-pages/lib-or-scratch/lib-or-scratch.component';
import { NodeViewComponent } from './components/sub-pages/node-view/node-view.component';
import { CategoriesComponent } from './components/sub-pages/categories/categories.component';
import { PhaseComponent } from './components/sub-pages/phases/phases.component';
import { HeaderComponent } from './components/header.component';
import { DisciplinesComponent } from './components/sub-pages/disciplines/disciplines.component';

@Component({
  standalone: true,
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    BasicsComponent,
    CategoriesComponent,
    CommonModule,
    DisciplinesComponent,
    FillElementDirective,
    GettingStartedComponent,
    HeaderComponent,
    LibOrScratchComponent,
    NodeViewComponent,
    PhaseComponent,
  ]
})
export class ProjectCreateComponent {
  @Select(ProjectCreateState.page) page$!: Observable<
    ProjectCreationPage | undefined
  >;
}
