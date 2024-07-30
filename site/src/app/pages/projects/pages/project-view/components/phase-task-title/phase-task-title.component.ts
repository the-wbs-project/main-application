import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisH, faPencil } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import { ProjectTaskViewModel, ProjectViewModel } from '@wbs/core/view-models';
import { PhaseTreeMenuService } from '../../services';

@Component({
  standalone: true,
  selector: 'wbs-phase-task-title',
  templateUrl: './phase-task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeMenuService],
  imports: [
    ContextMenuItemComponent,
    ContextMenuModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class PhaseTaskTitleComponent {
  private readonly menuService = inject(PhaseTreeMenuService);

  readonly editIcon = faPencil;
  readonly menuIcon = faEllipsisH;
  readonly project = input.required<ProjectViewModel>();
  readonly task = input.required<ProjectTaskViewModel>();
  readonly claims = input.required<string[]>();
  readonly canEdit = input.required<boolean>();
  readonly menu = signal<any[]>([]);
  readonly forcedShow = signal<boolean>(false);
  readonly edit = output<void>();
  readonly menuItemSelected = output<string>();

  protected buildMenu(): void {
    this.menu.set(
      this.menuService.buildMenu(this.project(), this.task(), this.claims())
    );
  }
}
