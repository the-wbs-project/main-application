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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-title-editor',
  templateUrl: './title-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TitleEditorComponent {
  @Input() title: string | undefined;
  @Output() titleChange = new EventEmitter<string>();

  readonly faCancel = faCancel;
  readonly faCheck = faCheck;
  readonly faEraser = faEraser;
  readonly faPencil = faPencil;
  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  edit(): void {
    this.editValue = this.title!;
    this.edit$.next(true);
  }

  saveTitle(): void {
    this.titleChange.emit(this.editValue);
    this.edit$.next(false);
  }
}
