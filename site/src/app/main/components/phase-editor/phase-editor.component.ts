import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategorySelectionService, DialogService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { ListItemDialogComponent } from '../list-item-dialog/list-item-dialog.component';
import { PhaseEditorItemComponent } from './phase-editor-item/phase-editor-item.component';

@Component({
  standalone: true,
  selector: 'wbs-phase-editor',
  templateUrl: './phase-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FontAwesomeModule,
    NgClass,
    PhaseEditorItemComponent,
    SortableModule,
    TranslateModule,
  ],
  providers: [CategorySelectionService, DialogService],
})
export class PhaseEditorComponent {
  @Input({ required: true }) categories?: CategorySelection[] | null;
  @Input() showButtons = true;
  @Input() showSave = false;
  @Output() readonly saveClicked = new EventEmitter<void>();
  @Output() readonly categoriesChange = new EventEmitter<CategorySelection[]>();

  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faPlus = faPlus;
  readonly isMobile = toSignal(this.store.select(UiState.isMobile));

  flip = false;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly catService: CategorySelectionService,
    private readonly dialogService: DialogService,
    private readonly store: Store
  ) {}

  changed(): void {
    this.rebuild();
  }

  showCreate() {
    this.dialogService
      .openDialog<[string, string] | null>(ListItemDialogComponent, {
        scrollable: true,
      })
      .subscribe((result) => {
        if (result == null) return;

        const item: CategorySelection = {
          id: IdService.generate(),
          description: result[1],
          isCustom: true,
          label: result[0],
          number: null,
          selected: true,
        };
        this.categories = [item, ...this.categories!];

        this.rebuild();
      });
  }

  rebuild() {
    this.catService.renumber(this.categories!);

    this.categories = [...this.categories!];

    this.categoriesChange.emit(this.categories!);
    this.cd.detectChanges();
  }
}
