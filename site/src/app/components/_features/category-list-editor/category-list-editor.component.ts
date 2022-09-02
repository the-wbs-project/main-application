import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { faEye, faEyeSlash, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import {
  CategorySelectionService,
  ContainerService,
  IdService,
} from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';
import { BehaviorSubject } from 'rxjs';
import { CustomDialog2Component } from './custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-category-list-editor',
  templateUrl: './category-list-editor.component.html',
  styleUrls: ['./category-list-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListEditorComponent {
  @Input() showButtons = true;
  @Input() categories?: CategorySelection[];
  @Input() categoryType?: 'phase' | 'discipline';
  @Output() categoriesChange = new EventEmitter<CategorySelection[]>();

  readonly hideUnselected$ = new BehaviorSubject<boolean>(false);
  readonly faCircle = faCircle;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faPlus = faPlus;

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly containers: ContainerService,
    private readonly dialog: DialogService
  ) {}

  changed(): void {
    this.catService.renumber(this.categories);
    this.categoriesChange.emit(this.categories);
  }

  showCreate() {
    const dialog = this.dialog.open({
      content: CustomDialog2Component,
      appendTo: this.containers.body,
    });

    (<CustomDialog2Component>dialog.content.instance).dialogTitle$.next(
      'Something.Something'
    );

    dialog.result.subscribe((result: [string, string] | DialogCloseResult) => {
      if (result instanceof DialogCloseResult) return;

      const item: CategorySelection = {
        id: IdService.generate(),
        description: result[1],
        isCustom: true,
        label: result[0],
        number: null,
        selected: true,
      };
      this.categories = [item, ...this.categories!];

      this.changed();
    });
  }
}
