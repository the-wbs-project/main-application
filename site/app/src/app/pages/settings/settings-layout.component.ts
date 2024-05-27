import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '@wbs/components/page-header';

@Component({
  standalone: true,
  template: `<div class="w-100 text-end p-3">
      <wbs-page-header />
    </div>
    <router-outlet />`,
  imports: [PageHeaderComponent, RouterModule],
})
export class SettingsLayoutComponent {}
