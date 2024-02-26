import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faGear } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECT_CLAIMS, ResourceRecord } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { ResourceTypeTextComponent } from '../record-resources-type-text';
import { ResourceViewLinkComponent } from '../resource-view-link';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-list',
  templateUrl: './record-resource-list.component.html',
  styleUrls: ['./record-resource-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DateTextPipe,
    DragDropModule,
    FontAwesomeModule,
    ResourceTypeTextComponent,
    ResourceViewLinkComponent,
    TranslateModule,
  ],
})
export class RecordResourceListComponent {
  readonly owner = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly list = model.required<ResourceRecord[]>();
  @Output() readonly save = new EventEmitter<ResourceRecord[]>();

  readonly editClaim = PROJECT_CLAIMS.RESOURCES.UPDATE;
  readonly deleteClaim = PROJECT_CLAIMS.RESOURCES.DELETE;

  readonly faBars = faBars;
  readonly faGear = faGear;
  readonly menu = [];

  onDrop({ previousIndex, currentIndex }: CdkDragDrop<any, any>): void {
    this.list.update((list) => {
      const originalList = structuredClone(list);
      const toMove = list[previousIndex];

      list.splice(previousIndex, 1);
      list.splice(currentIndex, 0, toMove);
      list.forEach((x, i) => (x.order = i + 1));

      const toSave = [];

      for (const item of list) {
        if (originalList.find((x) => x.id === item.id)!.order !== item.order) {
          toSave.push(item);
        }
      }
      if (toSave.length > 0) this.save.emit(toSave);

      return list;
    });
  }
}
