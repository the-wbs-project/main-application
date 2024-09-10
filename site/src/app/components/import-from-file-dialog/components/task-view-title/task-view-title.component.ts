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
import { faEllipsisH } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import { UploadDialogMenuService } from '../../services';
import { ImportTask } from '../../models';

@Component({
  standalone: true,
  selector: 'wbs-task-view-title',
  templateUrl: './task-view-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UploadDialogMenuService],
  imports: [
    ContextMenuItemComponent,
    ContextMenuModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class TaskViewTitleComponent {
  private readonly menuService = inject(UploadDialogMenuService);

  readonly menuIcon = faEllipsisH;
  readonly task = input.required<ImportTask>();
  readonly menu = signal<any[]>([]);
  readonly forcedShow = signal<boolean>(false);
  readonly menuItemSelected = output<string>();

  protected buildMenu(): void {
    this.menu.set(this.menuService.buildMenu(this.task()));
  }
}
