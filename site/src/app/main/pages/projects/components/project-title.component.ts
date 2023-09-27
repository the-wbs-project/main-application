import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryIconPipe } from '@wbs/main/pipes/category-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-title',
  template: `<div class="d-flex">
    <div class="wd-50 tx-center">
      <img
        *ngIf="category | categoryIcon; let url"
        [src]="url"
        class="wd-30 h-auto"
      />
    </div>
    <h4 class="w-100 pd-5 mg-b-0">{{ title }}</h4>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryIconPipe, NgIf],
})
export class ProjectTitleComponent {
  @Input() title?: string;
  @Input() category?: string;
}
