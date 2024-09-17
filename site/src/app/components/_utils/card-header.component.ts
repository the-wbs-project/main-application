import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';

@Component({
  standalone: true,
  selector: 'wbs-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopoverModule, TranslateModule],
  template: `{{ header() | translate }}
    <a kendoPopoverAnchor [popover]="myPopover" showOn="hover">
      <fa-icon [icon]="helpIcon" size="sm" class="mg-l-15" />
    </a>
    <kendo-popover #myPopover [position]="position()">
      <ng-template kendoPopoverBodyTemplate>
        <ng-content />
      </ng-template>
    </kendo-popover>`,
})
export class CardHeaderComponent {
  readonly helpIcon = faQuestionCircle;
  readonly header = input.required<string>();
  readonly position = input<Position>('bottom');
}
