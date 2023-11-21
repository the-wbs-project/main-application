import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
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
import { PhaseListItemComponent } from './discipline-list-item/discipline-list-item.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  templateUrl: './discipline-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FontAwesomeModule,
    NgClass,
    PhaseListItemComponent,
    SortableModule,
    TranslateModule,
  ],
  providers: [CategorySelectionService, DialogService],
})
export class DisciplineListComponent {
  @Input() showButtons = true;
  @Input() showSave = false;
  @Input() categories?: CategorySelection[] | null;
  @Input() categoryType?: 'discipline' | 'phase' | null;
  @Output() readonly saveClicked = new EventEmitter<void>();
  @Output() readonly categoriesChange = new EventEmitter<CategorySelection[]>();

  readonly hideUnselected = signal(false);
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
      .openDialog<[string, string] | null>(
        ListItemDialogComponent,
        {
          scrollable: true,
        },
        {
          showDescription: false,
        }
      )
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
