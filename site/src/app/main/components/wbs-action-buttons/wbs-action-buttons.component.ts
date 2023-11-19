import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ActionMenuItem } from '@wbs/core/models';
import { TrackByProp } from 'ngxtension/trackby-id-prop';

@Component({
  standalone: true,
  selector: 'wbs-action-buttons',
  template: `<div class="btn-group">
    <button
      type="button"
      *ngFor="let item of items ?? []; trackByProp: 'action'"
      class="btn btn-white btn-outline-dark"
      (click)="clicked.emit(item.action)"
      placement="bottom"
    >
      <fa-icon *ngIf="item.icon" [icon]="item.icon" />
      <span *ngIf="showTitle && item.text">
        {{ item.text | translate }}
      </span>
    </button>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule, TrackByProp, TranslateModule],
})
export class WbsActionButtonsComponent {
  @Input() items?: ActionMenuItem[];
  @Input() showTitle = true;
  @Output() readonly clicked = new EventEmitter<string>();
}
