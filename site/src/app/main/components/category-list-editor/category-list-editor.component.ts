import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LabelModule } from '@progress/kendo-angular-label';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategorySelectionService, DialogService } from '@wbs/main/services';
import { SwitchComponent } from '../switch';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';
import { UtilsModule } from '@progress/kendo-angular-utils';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { arrowsMoveIcon, SVGIcon } from '@progress/kendo-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-category-list-editor',
  templateUrl: './category-list-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonModule,
    CommonModule,
    FontAwesomeModule,
    LabelModule,
    SortableModule,
    SwitchComponent,
    TranslateModule,
    UtilsModule,
  ],
  providers: [CategorySelectionService, DialogService],
  styleUrls: ['./style.scss'],
})
export class CategoryListEditorComponent {
  public dropTargets = ['A', 'B', 'C', 'D'];
  public currentBox = 'A';
  public enteredBox = 'A';
  public btnText = 'Press the drag icon!';
  public moveIcon: SVGIcon = arrowsMoveIcon;

  public handleDrop(id: string): void {
    this.currentBox = id;
  }

  public handleDragEnter(id: string): void {
    this.enteredBox = id;
  }

  public handleDragLeave(): void {
    this.enteredBox = '';
  }
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

  flip = false;

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly dialogService: DialogService
  ) {}

  changed(): void {
    this.rebuild();
  }

  showCreate() {
    this.dialogService
      .openDialog<[string, string] | null>(CustomDialogComponent, {
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
    this.categoriesChange.emit(this.categories!);
  }
}
