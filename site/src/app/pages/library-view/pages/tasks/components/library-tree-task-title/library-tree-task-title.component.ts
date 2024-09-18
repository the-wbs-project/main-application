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
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { SaveState } from '@wbs/core/models';
import { LibraryTaskViewModel } from '@wbs/core/view-models';
import { LibraryTaskActionService } from '../../../../services';

@Component({
  standalone: true,
  selector: 'wbs-library-tree-task-title',
  templateUrl: './library-tree-task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LibraryTaskActionService],
  imports: [
    ContextMenuItemComponent,
    ContextMenuModule,
    FontAwesomeModule,
    NgClass,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class LibraryTreeTaskTitleComponent {
  private readonly actions = inject(LibraryTaskActionService);

  readonly menuIcon = faEllipsisH;
  readonly task = input.required<LibraryTaskViewModel>();
  readonly saveState = input.required<SaveState | undefined>();
  readonly menu = signal<any[]>([]);
  readonly forcedShow = signal<boolean>(false);
  readonly menuItemSelected = output<string>();

  protected buildMenu(): void {
    this.menu.set(this.actions.buildMenu(this.task()));
  }
}
