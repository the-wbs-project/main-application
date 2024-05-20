import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';
import { ResourceTypeIconPipe } from './pipes/resource-type-icon.pipe';
import { ResourceTypeNamePipe } from './pipes/resource-type-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-resource-type-text',
  template: `@if (type() | resourceTypeIcon; as icon) {
    <fa-icon [icon]="icon" /> } &nbsp;
    {{ type() | resourceTypeName | translate }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    ResourceTypeIconPipe,
    ResourceTypeNamePipe,
    TranslateModule,
  ],
})
export class ResourceTypeTextComponent {
  readonly type = input.required<RESOURCE_TYPE_TYPE>();
}
