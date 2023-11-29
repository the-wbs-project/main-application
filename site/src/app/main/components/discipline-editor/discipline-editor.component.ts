import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  ListViewComponent,
  ListViewModule,
} from '@progress/kendo-angular-listview';
import {
  DragAndDropModule,
  DragTargetContainerDirective,
  DropTargetContainerDirective,
  DropTargetEvent,
} from '@progress/kendo-angular-utils';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import {
  CategorySelectionService,
  DialogService,
  DragDropService,
} from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { DisciplineIconPipe } from '../../pipes/discipline-icon.pipe';
import { ListItemDialogComponent } from '../list-item-dialog/list-item-dialog.component';
import { SwitchComponent } from '../switch';

@Component({
  standalone: true,
  selector: 'wbs-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [CategorySelectionService, DialogService, DragDropService],
  imports: [
    DisciplineIconPipe,
    DragAndDropModule,
    FontAwesomeModule,
    ListViewModule,
    NgClass,
    TranslateModule,
    SwitchComponent,
  ],
})
export class DisciplineEditorComponent {
  @Input({ required: true }) categories!: CategorySelection[];
  @Input() showButtons = true;
  @Input() showSave = false;
  @Output() readonly saveClicked = new EventEmitter<void>();
  @Output() readonly categoriesChange = new EventEmitter<CategorySelection[]>();

  @ViewChild(ListViewComponent) listview!: ListViewComponent;
  @ViewChild('wrapper', { read: DragTargetContainerDirective })
  dragTargetContainer: any;
  @ViewChild('wrapper', { read: DropTargetContainerDirective })
  dropTargetContainer: any;

  readonly faBars = faBars;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faPlus = faPlus;
  readonly isMobile = toSignal(this.store.select(UiState.isMobile));

  flip = false;

  constructor(
    readonly dragDrop: DragDropService,
    private readonly cd: ChangeDetectorRef,
    private readonly catService: CategorySelectionService,
    private readonly dialogService: DialogService,
    private readonly store: Store
  ) {}

  changed(): void {
    this.rebuild();
  }

  onDrop(e: DropTargetEvent): void {
    this.dragDrop.onDrop(e, this.categories);

    this.rebuild();

    this.dragTargetContainer.notify();
    this.dropTargetContainer.notify();
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
