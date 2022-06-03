import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { AdminGuard } from '@wbs/shared/guards';
import { SharedModule } from '@wbs/shared/module';
import { BreadcrumbsComponent, UserGridComponent } from './components';
import { UserAdminGuard, UserRedirectGuard } from './guards';
import {
  GeneralComponent,
  GettingStartedComponent,
  UsersComponent,
} from './pages';
import { UserFilterPipe } from './pipes';
import { SettingsLayoutComponent } from './settings-layout.component';
import { UserAdminState } from './states';

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
        path: 'users',
        canActivate: [UserAdminGuard, UserRedirectGuard],
      },
      {
        path: 'users/:view',
        component: UsersComponent,
        canActivate: [UserAdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    GridModule,
    NgxsModule.forFeature([UserAdminState]),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    BreadcrumbsComponent,
    GettingStartedComponent,
    GeneralComponent,
    SettingsLayoutComponent,
    UserFilterPipe,
    UserGridComponent,
    UsersComponent,
  ],
  providers: [AdminGuard, UserAdminGuard, UserRedirectGuard],
})
export class SettingsModule {}
