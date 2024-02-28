import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wbs-main-wrapper',
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class MainWrapperComponent {}
