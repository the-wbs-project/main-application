import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  template: `<div class="w-100 text-end p-2"></div>
    <router-outlet />`,
  imports: [RouterModule],
})
export class SettingsLayoutComponent {}
