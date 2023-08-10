import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class MainWrapperComponent {}
