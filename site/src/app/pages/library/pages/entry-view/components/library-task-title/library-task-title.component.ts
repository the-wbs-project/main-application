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
import { EntryStore } from '@wbs/core/store';
import { LibraryTaskViewModel } from '@wbs/core/view-models';
import { LibraryTreeMenuService } from '../../services';

@Component({
  standalone: true,
  selector: 'wbs-library-task-title',
  templateUrl: './library-task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LibraryTreeMenuService],
  imports: [
    ContextMenuItemComponent,
    ContextMenuModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class LibraryTaskTitleComponent {
  private readonly entryStore = inject(EntryStore);
  private readonly menuService = inject(LibraryTreeMenuService);

  readonly editIcon = faPencil;
  readonly menuIcon = faEllipsisH;
  readonly task = input.required<LibraryTaskViewModel>();
  readonly canEdit = input.required<boolean>();
  readonly menu = signal<any[]>([]);
  readonly forcedShow = signal<boolean>(false);
  readonly edit = output<void>();
  readonly menuItemSelected = output<string>();

  protected buildMenu(): void {
    this.menu.set(
      this.menuService.buildMenu(
        this.entryStore.version()!,
        this.task(),
        this.entryStore.claims()
      )
    );
  }
}
