import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { UploaderComponent } from '@wbs/main/components/uploader/uploader.component';
import { RestrictionsPipe } from '../../pipes/restrictions.pipe';
import { RecordResourceViewModel } from '../../view-models';
import { ResourceTypeTextComponent } from '../resource-type-text.component';

@Component({
  standalone: true,
  selector: 'wbs-resource-editor',
  templateUrl: './resource-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownListModule,
    FormsModule,
    NgIf,
    ResourceTypeTextComponent,
    RestrictionsPipe,
    UploaderComponent,
  ],
})
export class ResourceEditorComponent {
  @Input({ required: true }) vm!: RecordResourceViewModel;

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
    RESOURCE_TYPES.YOUTUBE,
  ];

  constructor(private readonly store: Store) {}
}
