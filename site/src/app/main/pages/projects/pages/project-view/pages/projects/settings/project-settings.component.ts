import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class ProjectSettingsComponent {}
