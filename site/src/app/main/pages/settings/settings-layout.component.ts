import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './components/settings-breadcrumbs/settings-breadcrumbs.component';

@Component({
  standalone: true,
  template: `<wbs-settings-bread-crumbs /><br /><router-outlet />`,
  imports: [BreadcrumbsComponent, RouterModule],
})
export class SettingsLayoutComponent {}
