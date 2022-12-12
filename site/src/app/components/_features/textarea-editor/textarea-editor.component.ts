import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { faCancel, faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TextAreaComponent } from '@progress/kendo-angular-inputs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-textarea-editor',
  templateUrl: './textarea-editor.component.html',
  styleUrls: ['./textarea-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaEditorComponent {
  @Input() value: string | undefined | null;
  @Input() noValueMessage: string | undefined | null;
  @Input() fontSize = '12px';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('textbox', { static: false }) textbox?: TextAreaComponent;

  readonly faCancel = faCancel;
  readonly faCheck = faCheck;
  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  edit(): void {
    this.editValue = this.value!;
    this.edit$.next(true);

    setTimeout(() => {
      this.textbox!.focus();
    }, 50);
  }

  saveValue(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
    this.edit$.next(false);
  }
}
