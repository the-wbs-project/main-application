import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  faCancel,
  faCheck,
  faEraser,
  faPencil,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'wbs-title-editor',
  templateUrl: './title-editor.component.html',
  styleUrls: ['./title-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TitleEditorComponent {
  @Input() value = '';
  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<void>();

  readonly faCancel = faCancel;
  readonly faCheck = faCheck;
  readonly faEraser = faEraser;
  readonly faPencil = faPencil;
}
