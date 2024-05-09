import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGrid, faTable } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-project-view-toggle',
  templateUrl: './project-view-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class ProjectViewToggleComponent {
  readonly gridIcon = faGrid;
  readonly tableIcon = faTable;
  readonly view = input.required<'grid' | 'table'>();
  readonly changed = output<'grid' | 'table'>();
}
