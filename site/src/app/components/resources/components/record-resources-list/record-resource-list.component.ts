import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faGear } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceRecord } from '@wbs/core/models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
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
  readonly apiUrlPrefix = input.required<string>();
  readonly canEdit = input.required<boolean>();
  readonly canDelete = input.required<boolean>();
  readonly list = model.required<ResourceRecord[]>();
  readonly edit = output<ResourceRecord>();
  readonly save = output<ResourceRecord[]>();
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
