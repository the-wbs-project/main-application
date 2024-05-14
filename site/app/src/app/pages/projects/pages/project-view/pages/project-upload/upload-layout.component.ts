import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  template: `<div class="mg-t-40 mg-b-20"><router-outlet /></div>`,
  imports: [RouterModule],
})
export class ProjectUploadLayoutComponent {}
