import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';
import { ResourceTypeIconPipe } from './pipes/resource-type-icon.pipe';
import { ResourceTypeNamePipe } from './pipes/resource-type-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-resource-type-text',
  template: `<fa-icon *ngIf="type | resourceTypeIcon; let icon" [icon]="icon" />
    &nbsp; {{ type | resourceTypeName | translate }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgIf,
    ResourceTypeIconPipe,
    ResourceTypeNamePipe,
    TranslateModule,
  ],
})
export class ResourceTypeTextComponent {
  @Input({ required: true }) type!: RESOURCE_TYPE_TYPE;
}
