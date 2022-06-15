import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SwitchModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '@wbs/shared/module';
import {
  BasicsComponent,
  DisciplinesComponent,
  FooterComponent,
  GettingStartedComponent,
  HeaderComponent,
  LibOrScratchComponent,
  NodeViewComponent,
  PhaseComponent,
  ScopeComponent,
} from './components';
import { StartCreationGuard } from './guards';
import { ProjectCreateDescriptionPipe, ProjectCreateTitlePipe } from './pipes';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectCreateState } from './project-create.state';

const routes: Routes = [
  {
    path: '',
    component: ProjectCreateComponent,
    canActivate: [StartCreationGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ProjectCreateState]),
    RouterModule.forChild(routes),
    SharedModule,
    SwitchModule,
    TextBoxModule,
  ],
  providers: [StartCreationGuard],
  declarations: [
    BasicsComponent,
    DisciplinesComponent,
    FooterComponent,
    GettingStartedComponent,
    HeaderComponent,
    LibOrScratchComponent,
    NodeViewComponent,
    PhaseComponent,
    ProjectCreateComponent,
    ProjectCreateDescriptionPipe,
    ProjectCreateTitlePipe,
    ScopeComponent,
  ],
})
export class ProjectCreateModule {}
