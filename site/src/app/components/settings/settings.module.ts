import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { AdminGuard } from '@wbs/shared/guards';
import { SharedModule } from '@wbs/shared/module';
import {
  BreadcrumbsComponent,
  InviteActionsComponent,
  UserActionsComponent,
} from './components';
import { InviteAdminGuard, UserAdminGuard } from './guards';
import {
  GeneralComponent,
  GettingStartedComponent,
  InvitesComponent,
  InvitesFormComponent,
  UsersComponent,
} from './pages';
import { UserMgmtItemsPipe } from './pipes';
import { SettingsLayoutComponent } from './settings-layout.component';
import { SettingsState, UserAdminState } from './states';

export const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: GettingStartedComponent,
      },
      {
        path: 'general',
        component: GeneralComponent,
      },
      {
        path: 'users/:view',
        component: UsersComponent,
        canActivate: [UserAdminGuard],
      },
      {
        path: 'invites',
        component: InvitesComponent,
        canActivate: [InviteAdminGuard, UserAdminGuard],
      },
      {
        path: 'invites/:id',
        component: InvitesFormComponent,
        canActivate: [InviteAdminGuard, UserAdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    ContextMenuModule,
    GridModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    NgxsModule.forFeature([SettingsState, UserAdminState]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextBoxModule,
  ],
  declarations: [
    BreadcrumbsComponent,
    GettingStartedComponent,
    GeneralComponent,
    InviteActionsComponent,
    InvitesComponent,
    InvitesFormComponent,
    SettingsLayoutComponent,
    UserActionsComponent,
    UserMgmtItemsPipe,
    UsersComponent,
  ],
  providers: [AdminGuard, InviteAdminGuard, UserAdminGuard],
})
export class SettingsModule {}
